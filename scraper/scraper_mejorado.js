const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const https = require('https');

// ── HTTP client ──────────────────────────────────────────────────────────────
const axiosInstance = axios.create({
  timeout: 20000,
  headers: {
    'User-Agent':    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept':        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
    'Cache-Control': 'no-cache',
    'Pragma':        'no-cache',
  },
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
});

// ── Retry helper ─────────────────────────────────────────────────────────────
async function fetchWithRetry(url, retries = 3, delayMs = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await axiosInstance.get(url);
      return res;
    } catch (err) {
      if (attempt === retries) throw err;
      console.log(`    ↩️  Retry ${attempt}/${retries - 1} en ${delayMs / 1000}s...`);
      await new Promise(r => setTimeout(r, delayMs * attempt));
    }
  }
}

const BASE_URL = 'https://tworldstore.cl';

const categories = [
  { url: 'https://tworldstore.cl/10-hombre',              categoryName: 'Hombre'   },
  { url: 'https://tworldstore.cl/11-mujer',               categoryName: 'Mujer'    },
  { url: 'https://tworldstore.cl/23-calzado-de-seguridad',categoryName: 'Calzado'  },
  { url: 'https://tworldstore.cl/9-lineas',               categoryName: 'Líneas'   },
  { url: 'https://tworldstore.cl/14-epp',                 categoryName: 'EPP'      },
];

// ── helpers ──────────────────────────────────────────────────────────────────
function ensureAbsoluteUrl(url) {
  if (!url) return '';
  url = url.trim();
  if (url.startsWith('http')) return url;
  if (url.startsWith('//'))   return 'https:' + url;
  if (url.startsWith('/'))    return BASE_URL + url;
  return BASE_URL + '/' + url;
}

/**
 * Extrae el SKU real de la página de detalle del producto.
 * En Tworld el SKU está en la meta og:description o en un elemento
 * con clase "product-reference" o similar.
 * Fallback: parsear desde la URL (el número antes del slug).
 */
async function getProductDetail(productUrl) {
  try {
    const { data } = await fetchWithRetry(productUrl);
    const $ = cheerio.load(data);

    // ── SKU real ──────────────────────────────────────────────────────────
    // 1. Buscar referencia en el bloque de detalles del producto
    let sku = '';

    // Selector más común en PrestaShop Panda: span#product-reference-value o .product-reference
    const refEl = $('#product-reference-value, .product-reference span, [itemprop="sku"]').first();
    if (refEl.length) {
      sku = refEl.text().trim();
    }

    // 2. Buscar dentro de scripts JSON de PrestaShop
    if (!sku) {
      const refMatch = data.match(/"reference"\s*:\s*"([^"]+)"/);
      if (refMatch) sku = refMatch[1];
    }

    // 3. Buscar patrón "Referencia:" en texto
    if (!sku) {
      $('*').each((_, el) => {
        const text = $(el).text();
        const m = text.match(/Referencia[:\s]+([A-Z0-9\-]+)/i);
        if (m && m[1]) { sku = m[1]; return false; }
      });
    }

    // ── Colores completos desde página de detalle ─────────────────────────
    // En la página de detalle los colores aparecen como inputs radio o <li> con data-value
    const colors = [];
    const colorSet = new Set();

    // Método A: inputs con data-title (selector de atributos de PrestaShop)
    $('ul.product-variants-item input[type="radio"], .product-variants-item input').each((_, el) => {
      const title = $(el).attr('data-title') || $(el).attr('title') || '';
      const val   = $(el).val() || '';
      if (title && !colorSet.has(title.toUpperCase())) {
        colorSet.add(title.toUpperCase());
        colors.push({ name: title, value: val });
      }
    });

    // Método B: <li> en listas de variantes (algunos temas de PS)
    if (colors.length === 0) {
      $('ul.product-variants-item li').each((_, el) => {
        const title = $(el).attr('data-title') || $(el).find('[data-title]').attr('data-title') || '';
        const val   = $(el).attr('data-value') || '';
        if (title && !colorSet.has(title.toUpperCase())) {
          colorSet.add(title.toUpperCase());
          colors.push({ name: title, value: val });
        }
      });
    }

    // ── Tallas desde página de detalle ────────────────────────────────────
    const sizes = [];
    const sizeSet = new Set();

    $('select option, .product-variants-item input[type="radio"]').each((_, el) => {
      const text = $(el).text().trim() || $(el).attr('data-title') || '';
      if (
        text &&
        text !== 'Selecciona una opción' &&
        /^(XS|S|M|L|XL|XXL|XXXL|4XL|5XL|[0-9]+)$/i.test(text) &&
        !sizeSet.has(text.toUpperCase())
      ) {
        sizeSet.add(text.toUpperCase());
        sizes.push({ name: text });
      }
    });

    // ── Imágenes desde página de detalle ─────────────────────────────────
    const images = [];
    const imgSet  = new Set();

    // Todas las miniaturas / slides de la galería de detalle
    $('img.js-thumb, img[data-image-type], #thumbnails img, .product-images img, .slick-slide img').each((_, el) => {
      let src =
        $(el).attr('data-image-zoom') ||
        $(el).attr('data-large-image') ||
        $(el).attr('src') || '';
      // Preferir large_default
      src = src.replace(/(home_default|small_default|cart_default|medium_default)/, 'large_default');
      src = ensureAbsoluteUrl(src);
      if (src && !src.includes('placeholder') && !imgSet.has(src)) {
        imgSet.add(src);
        images.push(src);
      }
    });

    // ── Precios por volumen desde página de detalle ───────────────────────
    const volumePricing = [];

    // Método 1: JSON embebido de PrestaShop (prestashop.product o similar)
    // Buscar quantity_discounts en cualquier bloque <script>
    const scriptTags = $('script:not([src])').toArray();
    for (const scriptEl of scriptTags) {
      const scriptContent = $(scriptEl).html() || '';
      // Intentar extraer quantity_discounts del JSON de prestashop
      const qdMatch = scriptContent.match(/"quantity_discounts"\s*:\s*(\[.*?\])/s);
      if (qdMatch) {
        try {
          const discounts = JSON.parse(qdMatch[1]);
          if (Array.isArray(discounts) && discounts.length > 0) {
            for (const d of discounts) {
              const qty   = parseInt(d.quantity || d.from_quantity || d.min_quantity || 0);
              const raw   = d.price || d.price_to_display || d.value || '';
              const price = parseInt(String(raw).replace(/[^0-9]/g, '')) || 0;
              if (qty > 0 && price > 0) {
                const label = qty === 1 ? 'C/U' : `desde ${qty} articulos`;
                volumePricing.push({ minQuantity: qty, price, label });
              }
            }
          }
        } catch (_) {}
        if (volumePricing.length > 0) break;
      }
    }

    // Método 2: Tabla de descuentos por cantidad (PrestaShop estándar)
    if (volumePricing.length === 0) {
      $('table.table-product-discounts tbody tr, .quantity-discounts tbody tr, .product-discounts table tbody tr').each((_, row) => {
        const cells    = $(row).find('td');
        const qtyText  = cells.eq(0).text().trim();
        const priceText= cells.eq(1).text().trim() || cells.last().text().trim();
        const qty   = parseInt(qtyText.replace(/[^0-9]/g, ''));
        const price = parseInt(priceText.replace(/[^0-9]/g, ''));
        if (qty > 0 && price > 0) {
          const label = qty === 1 ? 'C/U' : `desde ${qty} articulos`;
          volumePricing.push({ minQuantity: qty, price, label });
        }
      });
    }

    // Método 3: Filas de precio con etiqueta de texto (diseño Panda/personalizado)
    // Busca patrones como "$8.090" seguido de "desde 3 articulos"
    if (volumePricing.length === 0) {
      // Buscar dentro de .product-prices, .price-container o .pro_kuan_box
      const priceContainers = $('.product-prices, .pro_second_box, .price-container, [class*="price"]');
      priceContainers.each((_, container) => {
        const fullText = $(container).text();
        // Buscar patrón: precio + etiqueta (ej. "$ 8.090 C/U" o "$ 8.090 desde 3 articulos")
        const matches = [...fullText.matchAll(/\$?\s*([0-9][0-9.]+)\s*(c\/u|desde\s+([0-9]+)\s*articulos?)/gi)];
        for (const m of matches) {
          const price = parseInt(m[1].replace(/\./g, ''));
          const labelRaw = m[2].trim().toLowerCase();
          const qty = labelRaw.startsWith('c') ? 1 : parseInt(m[3] || '0');
          if (price > 0 && qty > 0) {
            const label = qty === 1 ? 'C/U' : `desde ${qty} articulos`;
            volumePricing.push({ minQuantity: qty, price, label });
          }
        }
      });
    }

    // Ordenar por cantidad mínima
    volumePricing.sort((a, b) => a.minQuantity - b.minQuantity);

    return { sku, colors, sizes, images, volumePricing };
  } catch (err) {
    console.error(`  ⚠️ Error obteniendo detalle de ${productUrl}:`, err.message);
    return { sku: '', colors: [], sizes: [], images: [] };
  }
}

// ── Scraping de una categoría con paginación ─────────────────────────────────
async function scrapeCategory(cat) {
  console.log(`\n📁 Categoría: ${cat.categoryName}`);

  let allProducts = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const pageUrl = cat.url + (page > 1 ? `?page=${page}` : '');
    console.log(`  📄 Página ${page}: ${pageUrl}`);

    try {
      const { data } = await fetchWithRetry(pageUrl);
      const $ = cheerio.load(data);

      // Verificar si hay página siguiente
      hasNextPage =
        $('a.next').length > 0 ||
        $('link[rel="next"]').length > 0;

      // El selector correcto en Tworld es article.js-product-miniature
      const productElements = $('article.js-product-miniature, article.ajax_block_product');
      console.log(`  ✓ ${productElements.length} productos en página ${page}`);

      if (productElements.length === 0) {
        hasNextPage = false;
        break;
      }

      for (const el of productElements.toArray()) {
        const $el = $(el);

        // ── Nombre ────────────────────────────────────────────────────────
        const name =
          $el.find('h3.s_title_block a, h3.product-title a, .product-title a').first().text().trim() ||
          $el.find('h3 a, h2 a').first().text().trim();

        // ── URL del producto ──────────────────────────────────────────────
        const productLink =
          $el.find('h3.s_title_block a, h3.product-title a, .product-title a').first().attr('href') ||
          $el.find('a.tm_gallery_item_box').first().attr('href') || '';

        // ── ID interno PrestaShop ─────────────────────────────────────────
        const psId = $el.attr('data-id-product') || '';
        const psIdAttr = $el.attr('data-id-product-attribute') || '';

        // ── SKU visible en el listado (div pro_kuan_box con texto "SKU") ──
        let skuFromList = '';
        $el.find('.pro_kuan_box').each((_, box) => {
          const txt = $(box).text();
          const m = txt.match(/SKU\s*([A-Za-z0-9\-]+)/i);
          if (m) { skuFromList = m[1].trim(); return false; }
        });

        // ── Precio ────────────────────────────────────────────────────────
        const priceText = $el.find('.price span.price, span.price').first().text().trim();
        const price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;

        // ── Colores desde el listado (.variant-links a.color) ─────────────
        const colorsFromList = [];
        $el.find('.variant-links a.color').each((_, a) => {
          const colorName = $(a).attr('title') || $(a).attr('aria-label') || '';
          const styleAttr  = $(a).attr('style') || '';
          const hexMatch   = styleAttr.match(/background-color:\s*(#[0-9A-Fa-f]{3,6}|[a-z]+)/i);
          const hex        = hexMatch ? hexMatch[1] : '';
          const colorUrl   = $(a).attr('href') || '';
          if (colorName) {
            colorsFromList.push({
              name: colorName.trim().toUpperCase(),
              hex:  hex,
              url:  colorUrl,
            });
          }
        });

        // ── Imágenes desde el listado (swiper slides) ─────────────────────
        const imagesFromList = [];
        const imgSetList = new Set();
        $el.find('.swiper-slide img, img.tm_gallery_item').each((_, img) => {
          let src = $(img).attr('src') || $(img).attr('data-src') || '';
          src = ensureAbsoluteUrl(src);
          if (src && !src.includes('placeholder') && !imgSetList.has(src)) {
            imgSetList.add(src);
            imagesFromList.push(src);
          }
        });

        if (!name) {
          console.log(`  ⚠️ Producto sin nombre, omitido`);
          continue;
        }

        // ── Detalles desde página de producto ────────────────────────────
        let sku   = skuFromList;
        let colors = colorsFromList;
        let sizes  = [];
        let images = imagesFromList;
        let volumePricingFromDetail = [];

        if (productLink) {
          console.log(`    🔍 ${name.substring(0, 50)}`);
          const detail = await getProductDetail(productLink);

          // SKU: preferir el de la página de detalle si lo encontramos,
          // si no, usar el del listado, si no usar psId
          if (detail.sku) sku = detail.sku;
          else if (!sku)  sku = psId;

          // Colores: si la página de detalle tiene más, los usamos
          if (detail.colors.length > colorsFromList.length) colors = detail.colors;

          // Tallas
          if (detail.sizes.length > 0) sizes = detail.sizes;

          // Imágenes: si la página de detalle tiene más, las usamos
          if (detail.images.length > imagesFromList.length) images = detail.images;

          // Precios por volumen desde la página de detalle
          if (detail.volumePricing && detail.volumePricing.length > 0) {
            volumePricingFromDetail = detail.volumePricing;
          }

          // Pequeña pausa para no saturar el servidor
          await new Promise(r => setTimeout(r, 600));
        }

        const primaryImage   = images[0] || '';
        const secondaryImage = images[1] || images[0] || '';

        allProducts.push({
          id:             parseInt(psId) || Math.floor(Math.random() * 100000),
          psId:           psId,
          psIdAttribute:  psIdAttr,
          sku:            sku || `SKU-${psId}`,
          name,
          slug:           productLink
                            ? productLink.split('/').pop().replace(/\.html.*$/, '')
                            : name.toLowerCase().replace(/\s+/g, '-'),
          price,
          volumePricing:  volumePricingFromDetail,
          category:       cat.categoryName,
          images,
          primaryImage,
          secondaryImage,
          colors,
          sizes,
          isFeatured:     false,
          hasEmbroidery:  true,
          productUrl:     productLink,
        });

        console.log(`    ✓ SKU: ${sku || '(sin SKU)'} | ${colors.length} colores | ${sizes.length} tallas | ${volumePricingFromDetail.length} niveles de precio`);
      }

      page++;
      await new Promise(r => setTimeout(r, 1200));

    } catch (err) {
      console.error(`  ❌ Error en página ${page}:`, err.message);
      break;
    }
  }

  console.log(`  ✅ Total en categoría: ${allProducts.length} productos`);
  return allProducts;
}

// ── main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀 Iniciando scraper Tworld (SKU reales + colores)...\n');

  // Pausa inicial para que el servidor no rechace el primer request
  await new Promise(r => setTimeout(r, 1500));

  let allProducts = [];

  for (const cat of categories) {
    const prods = await scrapeCategory(cat);
    allProducts = [...allProducts, ...prods];
  }

  console.log(`\n✅ Total productos capturados: ${allProducts.length}\n`);

  // ── Guardar JSON raw ────────────────────────────────────────────────────
  const jsonPath = path.join(__dirname, 'productos_scrapedos.json');
  fs.writeFileSync(jsonPath, JSON.stringify({ timestamp: new Date().toISOString(), totalProducts: allProducts.length, products: allProducts }, null, 2));
  console.log(`📁 JSON guardado en: ${jsonPath}`);

  // ── Generar mockData.js para el frontend ────────────────────────────────
  const mockDataPath = path.join(__dirname, '../frontend/src/utils/mockData.js');
  const mockContent = `// Auto-generated from Tworldstore.cl scraper
// Generado: ${new Date().toLocaleString()}
// Total productos: ${allProducts.length}

export const banners = [
  { id: 1, img: 'https://tworldstore.cl/stupload/stswiper/lofty2.png',           url: '/productos' },
  { id: 2, img: 'https://tworldstore.cl/stupload/stswiper/jeans-practical.jpg',  url: '/productos' },
  { id: 3, img: 'https://tworldstore.cl/stupload/stswiper/secuoya.jpg',          url: '/productos' },
  { id: 4, img: 'https://tworldstore.cl/stupload/stswiper/mineiria.jpg',         url: '/productos' },
  { id: 5, img: 'https://tworldstore.cl/stupload/stswiper/jardinera.jpg',        url: '/productos' },
];

export const categories = [
  { id: 1, title: 'HOMBRE',  img: 'https://tworldstore.cl/stupload/stswiper/calugas-264x190.png',       slug: 'hombre'  },
  { id: 2, title: 'MUJER',   img: 'https://tworldstore.cl/stupload/stswiper/calugas-264x190-04.png',    slug: 'mujer'   },
  { id: 3, title: 'CALZADO', img: 'https://tworldstore.cl/stupload/stswiper/calugas-264x190-03.png',    slug: 'calzado' },
  { id: 4, title: 'LÍNEAS',  img: 'https://tworldstore.cl/stupload/stswiper/calugas-264x190-05.png',    slug: 'lineas'  },
  { id: 5, title: 'EPP',     img: 'https://tworldstore.cl/stupload/stswiper/calugas-264x190-01.png',    slug: 'epp'     },
];

export const products = ${JSON.stringify(allProducts, null, 2)};
`;

  fs.writeFileSync(mockDataPath, mockContent);
  console.log(`📁 mockData.js guardado en: ${mockDataPath}`);
  console.log('\n✅ Scraper completado!\n');
}

main().catch(err => {
  console.error('❌ Error fatal:', err);
  process.exit(1);
});
