const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Configurar timeout y user agent
const axiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  httpsAgent: new https.Agent({ rejectUnauthorized: false })
});

const BASE_URL = 'https://tworldstore.cl';

const categories = [
  { url: 'https://tworldstore.cl/10-hombre', categoryName: 'Hombre' },
  { url: 'https://tworldstore.cl/11-mujer', categoryName: 'Mujer' },
  { url: 'https://tworldstore.cl/23-calzado-de-seguridad', categoryName: 'Calzado' },
  { url: 'https://tworldstore.cl/9-lineas', categoryName: 'Líneas' },
  { url: 'https://tworldstore.cl/14-epp', categoryName: 'EPP' },
];

/**
 * Obtener todas las imágenes de un producto desde su página de detalle
 */
async function getProductImages(productUrl) {
  try {
    const { data } = await axiosInstance.get(productUrl);
    const $ = cheerio.load(data);
    
    const images = [];
    const imageMap = new Set();
    
    // Buscar en galerías de imágenes (PrestaShop Panda)
    // Generalmente están en .product-cover, .images-container, o elementos con data-image-zoom
    
    // Método 1: Buscar en el div de galería principal
    $('.images-container img').each((i, el) => {
      let imgSrc = $(el).attr('data-image-zoom') || 
                   $(el).attr('data-large-image') ||
                   $(el).attr('src');
      
      if (imgSrc && !imgSrc.includes('placeholder')) {
        imgSrc = ensureAbsoluteUrl(imgSrc);
        if (!imageMap.has(imgSrc)) {
          images.push(imgSrc);
          imageMap.add(imgSrc);
        }
      }
    });

    // Método 2: Buscar en thumbnails
    $('.product-cover .thumb-container img').each((i, el) => {
      let imgSrc = $(el).attr('data-image-zoom') || 
                   $(el).attr('src');
      
      if (imgSrc && !imgSrc.includes('placeholder')) {
        imgSrc = ensureAbsoluteUrl(imgSrc);
        if (!imageMap.has(imgSrc)) {
          images.push(imgSrc);
          imageMap.add(imgSrc);
        }
      }
    });

    // Método 3: Script JSON (PrestaShop a veces tiene JSON en el HTML)
    const scriptMatch = data.match(/var\s+product\s*=\s*({[\s\S]*?});/);
    if (scriptMatch) {
      try {
        const productJson = JSON.parse(scriptMatch[1]);
        if (productJson.images) {
          productJson.images.forEach(img => {
            if (img && img.legend) {
              let imgUrl = img.id_image ? `${BASE_URL}/img/p/${img.id_image}/` : img.cover;
              if (imgUrl && !imageMap.has(imgUrl)) {
                images.push(ensureAbsoluteUrl(imgUrl));
                imageMap.add(imgUrl);
              }
            }
          });
        }
      } catch (e) {
        // El JSON no es válido, continuar
      }
    }

    return images.slice(0, 10); // Máximo 10 imágenes por producto
  } catch (err) {
    console.error(`Error obteniendo imágenes de ${productUrl}:`, err.message);
    return [];
  }
}

/**
 * Obtener variantes (colores y tallas) de un producto
 */
async function getProductVariants(productUrl) {
  try {
    const { data } = await axiosInstance.get(productUrl);
    
    // Buscar en script JSON de atributos
    const attrMatch = data.match(/var\s+attributes\s*=\s*({[\s\S]*?});/);
    if (!attrMatch) {
      return { colors: [], sizes: [] };
    }

    try {
      const attributes = JSON.parse(attrMatch[1]);
      let colors = [];
      let sizes = [];

      // Buscar select de colores y tallas en el HTML
      const $ = cheerio.load(data);
      
      // Colores
      $('select#group_1, select[name*="color"], select[data-attribute*="color"]').each((i, el) => {
        $(el).find('option').each((j, opt) => {
          const value = $(opt).val();
          const text = $(opt).text().trim();
          if (text && text !== 'Selecciona una opción') {
            colors.push({ name: text, value });
          }
        });
      });

      // Tallas
      $('select#group_2, select[name*="size"], select[data-attribute*="size"]').each((i, el) => {
        $(el).find('option').each((j, opt) => {
          const value = $(opt).val();
          const text = $(opt).text().trim();
          if (text && text !== 'Selecciona una opción') {
            sizes.push({ name: text, value });
          }
        });
      });

      // Si no encuentra en selects, buscar en la estructura de botones o divs
      if (colors.length === 0) {
        $('.product-variants .form-group').each((i, el) => {
          if ($(el).find('label').text().toLowerCase().includes('color')) {
            $(el).find('input, button').each((j, variant) => {
              const text = $(variant).attr('data-title') || $(variant).text().trim();
              const value = $(variant).val() || $(variant).attr('value') || text;
              if (text) colors.push({ name: text, value });
            });
          }
        });
      }

      if (sizes.length === 0) {
        $('.product-variants .form-group').each((i, el) => {
          if ($(el).find('label').text().toLowerCase().includes('talla') || 
              $(el).find('label').text().toLowerCase().includes('size')) {
            $(el).find('input, button').each((j, variant) => {
              const text = $(variant).attr('data-title') || $(variant).text().trim();
              const value = $(variant).val() || $(variant).attr('value') || text;
              if (text) sizes.push({ name: text, value });
            });
          }
        });
      }

      // Eliminar duplicados
      colors = Array.from(new Map(colors.map(c => [c.name, c])).values());
      sizes = Array.from(new Map(sizes.map(s => [s.name, s])).values());

      return { colors, sizes };
    } catch (e) {
      console.error(`Error parseando variantes:`, e.message);
      return { colors: [], sizes: [] };
    }
  } catch (err) {
    console.error(`Error obteniendo variantes de ${productUrl}:`, err.message);
    return { colors: [], sizes: [] };
  }
}

/**
 * Asegurar que las URLs de imágenes sean absolutas
 */
function ensureAbsoluteUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('//')) return 'https:' + url;
  if (url.startsWith('/')) return BASE_URL + url;
  return BASE_URL + '/' + url;
}

/**
 * Scraping de categoría con paginación
 */
async function scrapeCategory(cat) {
  try {
    console.log(`\n📁 Scrapeando categoría: ${cat.categoryName}`);
    
    let allProducts = [];
    let page = 1;
    let hasNextPage = true;

    while (hasNextPage) {
      const pageUrl = cat.url + (page > 1 ? `?page=${page}` : '');
      console.log(`  📄 Página ${page}: ${pageUrl}`);

      try {
        const { data } = await axiosInstance.get(pageUrl);
        const $ = cheerio.load(data);

        // Verificar si hay más páginas
        hasNextPage = $('a.next').length > 0 || 
                      $('link[rel="next"]').length > 0 ||
                      data.includes(`page=${page + 1}`);

        const productElements = $('.product-miniature, .product-item, article.product-item');
        console.log(`  ✓ Encontrados ${productElements.length} productos en página ${page}`);

        if (productElements.length === 0) {
          hasNextPage = false;
          break;
        }

        for (const el of productElements.toArray()) {
          const $el = $(el);
          
          const name = $el.find('.product-title a, .product-name').text().trim();
          const productLink = $el.find('a.product-link, .product-title a').attr('href');
          let sku = $el.attr('data-id-product') || $el.attr('data-product-id') || '';
          
          // Extraer precio
          let priceText = $el.find('.price, [data-price]').text().trim();
          const price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;

          // Imagen primaria desde el listado
          let image = $el.find('img.front-image, img.product-thumbnail').attr('data-src') ||
                      $el.find('img.front-image, img.product-thumbnail').attr('src') || '';
          image = ensureAbsoluteUrl(image);

          if (!name || !image) {
            console.log(`  ⚠️ Producto sin nombre o imagen, omitido`);
            continue;
          }

          // Si tenemos URL del producto, extraer más detalles
          let images = [image];
          let variants = { colors: [], sizes: [] };

          if (productLink) {
            try {
              console.log(`    🔍 Obteniendo detalles de: ${name.substring(0, 40)}...`);
              
              // Obtener más imágenes
              const moreImages = await getProductImages(productLink);
              if (moreImages.length > 0) {
                images = moreImages;
              }

              // Obtener variantes
              variants = await getProductVariants(productLink);

              await new Promise(resolve => setTimeout(resolve, 500)); // Esperar entre requests
            } catch (err) {
              console.log(`    ⚠️ Error obteniendo detalles: ${err.message}`);
            }
          }

          allProducts.push({
            id: parseInt(sku) || Math.floor(Math.random() * 100000),
            sku: sku || `SKU-${Math.floor(Math.random() * 10000)}`,
            name: name,
            slug: productLink ? productLink.split('/').pop().replace('.html', '') : name.toLowerCase().replace(/ /g, '-'),
            price: price,
            category: cat.categoryName,
            images: images,
            primaryImage: images[0] || image,
            secondaryImage: images[1] || images[0] || image,
            colors: variants.colors,
            sizes: variants.sizes,
            isFeatured: false,
            hasEmbroidery: true,
            productUrl: productLink || ''
          });

          console.log(`    ✓ ${name} - ${variants.colors.length} colores, ${variants.sizes.length} tallas`);
        }

        page++;
        
        // Esperar entre páginas
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (err) {
        console.error(`  ❌ Error scrapeando página ${page}:`, err.message);
        break;
      }
    }

    console.log(`  ✅ Categoría completa: ${allProducts.length} productos`);
    return allProducts;

  } catch (err) {
    console.error(`❌ Error scrapeando categoría ${cat.categoryName}:`, err.message);
    return [];
  }
}

/**
 * Función principal
 */
async function main() {
  console.log('🚀 Iniciando scraper mejorado para Tworld...\n');
  
  let allProducts = [];
  
  for (const cat of categories) {
    const prods = await scrapeCategory(cat);
    allProducts = [...allProducts, ...prods];
  }

  console.log(`\n✅ Total de productos capturados: ${allProducts.length}\n`);

  // Generar datos en formato JSON para backend
  const output = {
    timestamp: new Date().toISOString(),
    totalProducts: allProducts.length,
    products: allProducts
  };

  // Guardar JSON
  const jsonPath = path.join(__dirname, 'productos_scrapedos.json');
  fs.writeFileSync(jsonPath, JSON.stringify(output, null, 2));
  console.log(`📁 Guardado en: ${jsonPath}`);

  // Generar también mockData.js para frontend
  const mockDataPath = path.join(__dirname, '../frontend/src/utils/mockData.js');
  const mockContent = `
// Auto-generated mock data from Tworldstore.cl scraper
// Generado: ${new Date().toLocaleString()}
// Total productos: ${allProducts.length}

export const banners = [
  { id: 1, img: 'https://tworldstore.cl/stupload/stswiper/lofty2.png', url: '/productos' },
  { id: 2, img: 'https://tworldstore.cl/stupload/stswiper/jeans-practical.jpg', url: '/productos' },
  { id: 3, img: 'https://tworldstore.cl/stupload/stswiper/secuoya.jpg', url: '/productos' },
  { id: 4, img: 'https://tworldstore.cl/stupload/stswiper/mineiria.jpg', url: '/productos' },
  { id: 5, img: 'https://tworldstore.cl/stupload/stswiper/jardinera.jpg', url: '/productos' },
];

export const categories = [
  { id: 1, title: 'HOMBRE', img: 'https://tworldstore.cl/stupload/stswiper/calugas-264x190.png', slug: 'hombre' },
  { id: 2, title: 'MUJER', img: 'https://tworldstore.cl/stupload/stswiper/calugas-264x190-04.png', slug: 'mujer' },
  { id: 3, title: 'CALZADO', img: 'https://tworldstore.cl/stupload/stswiper/calugas-264x190-03.png', slug: 'calzado' },
  { id: 4, title: 'LÍNEAS', img: 'https://tworldstore.cl/stupload/stswiper/calugas-264x190-05.png', slug: 'lineas' },
  { id: 5, title: 'EPP', img: 'https://tworldstore.cl/stupload/stswiper/calugas-264x190-01.png', slug: 'epp' },
];

export const products = ${JSON.stringify(allProducts, null, 2)};
`;

  fs.writeFileSync(mockDataPath, mockContent);
  console.log(`📁 Guardado mockData en: ${mockDataPath}`);

  console.log('\n✅ Scraper completado correctamente!\n');
}

main().catch(err => {
  console.error('❌ Error fatal:', err);
  process.exit(1);
});
