const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('hombre.html', 'utf-8');
const $ = cheerio.load(html);

const firstProduct = $('.ajax_block_product').first();
console.log("HTML of first product:");
console.log(firstProduct.html());
