const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const categories = [
  { url: 'https://tworldstore.cl/10-hombre', slug: '10-hombre', categoryName: '10-hombre' },
  { url: 'https://tworldstore.cl/11-mujer', slug: '11-mujer', categoryName: '11-mujer' },
  { url: 'https://tworldstore.cl/23-calzado-de-seguridad', slug: '12-calzado', categoryName: '12-calzado' },
  { url: 'https://tworldstore.cl/9-lineas', slug: '9-lineas', categoryName: '9-lineas' },
  { url: 'https://tworldstore.cl/14-epp', slug: 'epp', categoryName: 'epp' },
];

async function scrapeCategory(cat) {
  try {
    console.log(`Scraping ${cat.url}...`);
    const { data } = await axios.get(cat.url);
    const $ = cheerio.load(data);
    
    const products = [];
    
    $('.ajax_block_product').each((i, el) => {
      // Name
      const name = $(el).find('.s_title_block a').text().trim();
      
      // Image
      let img = $(el).find('img.tm_gallery_item').first().attr('src');
      if (!img) img = $(el).find('img').attr('src') || $(el).find('img').attr('data-src');
      
      // Link
      const link = $(el).find('.s_title_block a').attr('href') || '';
      const slug = link.split('/').pop().replace('.html', '') || name.toLowerCase().replace(/ /g, '-');
      
      // Price
      let priceText = $(el).find('.price').first().text().trim();
      let price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
      
      // SKU
      let sku = '00000';
      $(el).find('.pro_kuan_box').each((j, box) => {
        const text = $(box).text().trim();
        if (text.includes('SKU')) {
           sku = text.replace('SKU', '').trim();
        }
      });
      
      // Colors
      let colors = [];
      $(el).find('.variant-links a.color').each((j, c) => {
         colors.push({
            name: $(c).attr('title') || 'Color',
            hex: $(c).css('background-color') || '#cccccc'
         });
      });
      if (colors.length === 0) colors.push({ name: 'ÚNICO', hex: '#666666' });

      if (name && img) {
        products.push({
          id: Math.floor(Math.random() * 100000),
          slug,
          name,
          sku,
          price,
          image: img,
          hoverImage: img,
          category: cat.categoryName,
          colors: colors,
          variants: [{ size: 'M', stock: 10 }, { size: 'L', stock: 5 }]
        });
      }
    });
    
    return products;
  } catch (err) {
    console.error(`Error scraping ${cat.url}:`, err.message);
    return [];
  }
}

async function main() {
  let allProducts = [];
  
  for (const cat of categories) {
    const prods = await scrapeCategory(cat);
    allProducts = [...allProducts, ...prods];
    console.log(`Extracted ${prods.length} products from ${cat.categoryName}`);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Agregamos la polera inicial que el usuario pidió con detalle B2B (precio por vol y tallas completas)
  const basePolera = {
    id: 1001,
    slug: 'polera-100-algodon-manga-larga',
    name: 'Polera 100% Algodón Manga Larga',
    sku: '01074',
    price: 5891,
    volumePricing: [
      { minQuantity: 1, price: 5891, label: 'C/U' },
      { minQuantity: 3, price: 5489, label: 'desde 3 articulos' },
      { minQuantity: 10, price: 5090, label: 'desde 10 articulos' },
    ],
    image: 'https://tworldstore.cl/3028-large_default/polera-100-algodon-manga-larga-hombre.jpg',
    hoverImage: 'https://tworldstore.cl/3029-large_default/polera-100-algodon-manga-larga-hombre.jpg',
    category: '10-hombre',
    isFeatured: true,
    hasEmbroidery: true,
    maxSize: 'XXXL',
    description: 'Confort Natural y Protección Solar. Confeccionada con 100% algodón peinado.',
    details: { Composición: '100% Algodón', Gramaje: '170 gramos', Género: 'Hombre', Tela: 'Jersey', Tecnologías: 'Protección UV' },
    colors: [{ name: 'AZULINO', hex: '#0b38db' }, { name: 'BLANCO', hex: '#ffffff' }, { name: 'NEGRO', hex: '#000000' }],
    variants: [
      { size: 'S', stock: 10 }, { size: 'M', stock: 15 }, { size: 'L', stock: 20 },
      { size: 'XL', stock: 5 }, { size: 'XXL', stock: 2 }, { size: 'XXXL', stock: 0 }
    ]
  };
  
  const baseBotin = {
    id: 1002,
    slug: 'botin-seguridad-edimburgo',
    name: 'Botín de Seguridad Edimburgo',
    sku: '03001',
    price: 34990,
    image: 'https://tworldstore.cl/239-home_default/botin-de-seguridad-edimburgo.jpg',
    hoverImage: 'https://tworldstore.cl/240-home_default/botin-de-seguridad-edimburgo.jpg',
    category: '12-calzado',
    isFeatured: true,
    colors: [{ name: 'CAFE', hex: '#654321' }],
    variants: [{ size: '40', stock: 5 }]
  };

  allProducts = [basePolera, baseBotin, ...allProducts];

  // Remove duplicates based on SKU just in case
  const uniqueProducts = Array.from(new Map(allProducts.map(item => [item.sku, item])).values());

  const content = `
export const banners = [
  { id: 1, img: 'https://tworldstore.cl/stupload/stswiper/lofty2.png', url: '/productos' },
  { id: 2, img: 'https://tworldstore.cl/stupload/stswiper/jeans-practical.jpg', url: '/productos' },
  { id: 3, img: 'https://tworldstore.cl/stupload/stswiper/secuoya.jpg', url: '/productos' },
  { id: 4, img: 'https://tworldstore.cl/stupload/stswiper/mineiria.jpg', url: '/productos' },
  { id: 5, img: 'https://tworldstore.cl/stupload/stswiper/jardinera.jpg', url: '/productos' },
];

export const categories = [
  { id: 1, title: 'PRODUCTOS CERTIFICADOS', img: 'https://tworldstore.cl/stupload/stswiper/calugas-264x190.png', slug: 'certificados' },
  { id: 2, title: 'PANTALONES Y JEANS', img: 'https://tworldstore.cl/stupload/stswiper/calugas-264x190-04.png', slug: 'pantalones' },
  { id: 3, title: 'CAMISAS Y BLUSAS', img: 'https://tworldstore.cl/stupload/stswiper/calugas-264x190-03.png', slug: 'camisas' },
  { id: 4, title: 'PARKAS Y CHAQUETAS', img: 'https://tworldstore.cl/stupload/stswiper/calugas-264x190-05.png', slug: 'parkas' },
  { id: 5, title: 'POLERAS Y POLERONES', img: 'https://tworldstore.cl/stupload/stswiper/calugas-264x190-01.png', slug: 'poleras' },
  { id: 6, title: 'CALZADO DE SEGURIDAD', img: 'https://tworldstore.cl/239-home_default/botin-de-seguridad-edimburgo.jpg', slug: '12-calzado' },
];

export const products = ${JSON.stringify(uniqueProducts, null, 2)};
`;

  const targetPath = path.join(__dirname, '../frontend/src/utils/mockData.js');
  fs.writeFileSync(targetPath, content);
  console.log(\`Saved \${uniqueProducts.length} products to \${targetPath}\`);
}

main();
