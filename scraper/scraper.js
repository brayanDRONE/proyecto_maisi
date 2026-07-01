const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const categories = [
  { url: 'https://tworldstore.cl/10-hombre', slug: '10-hombre', categoryName: 'hombre' },
  { url: 'https://tworldstore.cl/11-mujer', slug: '11-mujer', categoryName: 'mujer' },
  { url: 'https://tworldstore.cl/23-calzado-de-seguridad', slug: '12-calzado', categoryName: 'calzado' },
  { url: 'https://tworldstore.cl/9-lineas', slug: '9-lineas', categoryName: 'vestuario' },
  { url: 'https://tworldstore.cl/14-epp', slug: 'epp', categoryName: 'epp' },
];

async function scrapeCategory(cat) {
  try {
    console.log(`Scraping ${cat.url}...`);
    // PrestaShop uses product lists. We can get all if we add ?resultsPerPage=999 or just parse the first page.
    // Let's just parse what is there.
    const { data } = await axios.get(cat.url);
    const $ = cheerio.load(data);
    
    const products = [];
    
    // In PrestaShop (Panda Theme), products are usually inside .product-miniature or similar
    $('.product-miniature').each((i, el) => {
      const name = $(el).find('.product-title a').text().trim() || $(el).find('.h3.product-title').text().trim();
      const url = $(el).find('.product-title a').attr('href') || $(el).find('a.thumbnail.product-thumbnail').attr('href');
      
      // Images
      const imgEl = $(el).find('img.front-image');
      const imgHoverEl = $(el).find('img.back-image');
      let image = imgEl.attr('data-src') || imgEl.attr('src');
      let hoverImage = imgHoverEl.attr('data-src') || imgHoverEl.attr('src') || image;
      
      // Price
      let priceStr = $(el).find('.price').text().trim();
      let price = parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;
      
      // SKU is sometimes hidden or in data attributes
      let sku = $(el).attr('data-id-product') || `sku-${Math.floor(Math.random() * 10000)}`;

      if (name && image) {
        products.push({
          id: parseInt($(el).attr('data-id-product') || Math.floor(Math.random() * 10000)),
          slug: url ? url.split('/').pop().replace('.html', '') : name.toLowerCase().replace(/ /g, '-'),
          name,
          sku,
          price,
          image,
          hoverImage,
          category: cat.categoryName,
          categorySlug: cat.slug,
          isFeatured: false,
          colors: [{ name: 'DEFAULT', hex: '#cccccc' }] // mock
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
    // Wait a bit to be polite
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Generate JS file content
  const content = `
// Auto-generated mock data from Tworldstore.cl scraper
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

export const products = ${JSON.stringify(allProducts, null, 2)};
`;

  const targetPath = path.join(__dirname, '../frontend/src/utils/mockData.js');
  fs.writeFileSync(targetPath, content);
  console.log(`Saved ${allProducts.length} products to ${targetPath}`);
}

main();
