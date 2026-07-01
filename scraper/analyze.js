const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('hombre.html', 'utf-8');
const $ = cheerio.load(html);

console.log("Analyzing HTML...");

// En PrestaShop los productos suelen estar dentro de un div con class "product" o "ajax_block_product" o "product-miniature"
let products = [];

$('.product-miniature').each((i, el) => {
  products.push({
    name: $(el).find('.product-title').text().trim(),
    price: $(el).find('.price').text().trim(),
    img: $(el).find('img').attr('src') || $(el).find('img').attr('data-src')
  });
});

console.log(`Found ${products.length} products with .product-miniature`);

if (products.length === 0) {
  // try another common class
  $('.ajax_block_product').each((i, el) => {
    products.push({
      name: $(el).find('.product-name').text().trim(),
      price: $(el).find('.content_price').text().trim(),
      img: $(el).find('img').attr('src')
    });
  });
  console.log(`Found ${products.length} products with .ajax_block_product`);
}

if (products.length === 0) {
  // Let's just find all product images to guess the container
  const imgs = $('img').map((i, el) => $(el).attr('src')).get().filter(src => src && src.includes('home_default'));
  console.log(`Found ${imgs.length} product images with 'home_default' in src`);
  
  // Find parent of first image
  if (imgs.length > 0) {
     const firstImg = $(`img[src="${imgs[0]}"]`);
     console.log("Classes of parent hierarchy:");
     let parent = firstImg.parent();
     for(let i=0; i<5; i++) {
        console.log(`Level ${i}: ${parent.prop('tagName')} class="${parent.attr('class')}"`);
        parent = parent.parent();
     }
  }
}

console.log(products.slice(0, 3));
