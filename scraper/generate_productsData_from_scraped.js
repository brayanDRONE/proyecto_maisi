const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const INPUT_PATH = path.join(__dirname, 'productos_scrapedos.json');
const OUTPUT_PATH = path.join(ROOT, 'frontend', 'src', 'utils', 'productsData.js');

const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function normalizeCategory(raw) {
  const value = String(raw || '').toLowerCase();
  if (value.includes('hombre')) return { id: '10-hombre', label: 'Hombre' };
  if (value.includes('mujer')) return { id: '11-mujer', label: 'Mujer' };
  return null;
}

function normalizeSku(rawSku, fallback) {
  const digits = String(rawSku || '').replace(/\D/g, '');
  if (digits.length >= 5) return digits.slice(0, 5);
  if (digits.length > 0) return digits;
  return String(fallback || '').slice(0, 5) || '00000';
}

function normalizeColor(color) {
  if (!color || typeof color !== 'object') return null;
  const name = String(color.name || '').trim().toUpperCase();
  if (!name) return null;

  let hex = String(color.hex || '').trim();
  if (!hex) hex = '#cccccc';
  if (!hex.startsWith('#')) hex = '#cccccc';

  return {
    name,
    hex,
    url: String(color.url || ''),
  };
}

function buildProduct(prod) {
  const cat = normalizeCategory(prod.category);
  if (!cat) return null;

  const rawImages = Array.isArray(prod.images) ? prod.images.filter(Boolean) : [];
  const primaryImage = prod.primaryImage || rawImages[0] || '';
  const secondaryImage = prod.secondaryImage || rawImages[1] || primaryImage;
  const gallery = rawImages.slice(0, 6);

  const colors = Array.isArray(prod.colors)
    ? prod.colors.map(normalizeColor).filter(Boolean)
    : [];

  const scrapedSizes = Array.isArray(prod.sizes)
    ? prod.sizes
        .map((s) => (typeof s === 'string' ? s : s?.name))
        .filter(Boolean)
        .map((s) => String(s).trim().toUpperCase())
    : [];

  const sizes = scrapedSizes.length > 0 ? Array.from(new Set(scrapedSizes)) : DEFAULT_SIZES;
  const variants = sizes.map((size) => ({ size, stock: 10 }));

  const price = Number(prod.price) || 0;
  const sku5 = normalizeSku(prod.sku, prod.id);
  const id = String(prod.id || prod.psId || sku5);
  const safeName = String(prod.name || 'Producto sin nombre').trim();

  // Usar volumePricing scrapeado si está disponible y tiene los 3 niveles esperados;
  // si no, construir los 3 niveles con el mismo precio base (fallback)
  let volumePricing;
  if (Array.isArray(prod.volumePricing) && prod.volumePricing.length > 0) {
    // Asegurar que siempre hay exactamente los 3 niveles esperados: 1, 3 y 10
    const getPrice = (minQty) => {
      // Buscar el precio del nivel con minQuantity <= minQty (precio aplicable)
      const applicable = prod.volumePricing
        .filter(t => t.minQuantity <= minQty)
        .sort((a, b) => b.minQuantity - a.minQuantity);
      return applicable.length > 0 ? Number(applicable[0].price) : price;
    };
    volumePricing = [
      { minQuantity: 1,  price: getPrice(1),  label: 'C/U' },
      { minQuantity: 3,  price: getPrice(3),  label: 'desde 3 articulos' },
      { minQuantity: 10, price: getPrice(10), label: 'desde 10 articulos' },
    ];
  } else {
    volumePricing = [
      { minQuantity: 1,  price, label: 'C/U' },
      { minQuantity: 3,  price, label: 'desde 3 articulos' },
      { minQuantity: 10, price, label: 'desde 10 articulos' },
    ];
  }

  return {
    id,
    sku: sku5,
    slug: `${slugify(safeName)}-${id}`,
    name: safeName,
    price: volumePricing[0].price,  // siempre usar precio C/U (primer nivel)
    category: cat.id,
    categoryLabel: cat.label,
    volumePricing,
    shortDesc: '',
    fullDesc: '',
    image: primaryImage,
    hoverImage: secondaryImage,
    gallery,
    variants,
    sizes,
    colors,
    url: String(prod.productUrl || ''),
  };
}

function main() {
  if (!fs.existsSync(INPUT_PATH)) {
    throw new Error(`No existe archivo de entrada: ${INPUT_PATH}`);
  }

  const raw = JSON.parse(fs.readFileSync(INPUT_PATH, 'utf-8'));
  const list = Array.isArray(raw.products) ? raw.products : [];

  const mapped = list
    .map(buildProduct)
    .filter(Boolean)
    .filter((p) => p.category === '10-hombre' || p.category === '11-mujer');

  const seen = new Set();
  const unique = [];

  for (const product of mapped) {
    if (seen.has(product.id)) continue;
    seen.add(product.id);
    unique.push(product);
  }

  const content = `// AUTO-GENERATED from productos_scrapedos.json - DO NOT EDIT MANUALLY\nconst _products = ${JSON.stringify(unique, null, 2)};\n\nexport const catalogCategories = [\n  { id: '10-hombre', label: 'Hombre', slug: '10-hombre' },\n  { id: '11-mujer', label: 'Mujer', slug: '11-mujer' }\n];\n\nexport const products = _products;\n`;

  fs.writeFileSync(OUTPUT_PATH, content, 'utf-8');

  const byCategory = unique.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  console.log('productsData.js actualizado');
  console.log(`Total productos: ${unique.length}`);
  console.log(`Hombre: ${byCategory['10-hombre'] || 0}`);
  console.log(`Mujer: ${byCategory['11-mujer'] || 0}`);
}

main();
