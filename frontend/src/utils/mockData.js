export const banners = [
  { id: 1, img: 'https://tworldstore.cl/5066-large_default/polera-ml-hombre-100-alg-170g.jpg', url: '/10-hombre' },
  { id: 2, img: 'https://tworldstore.cl/4338-large_default/polera-hibrida-dual-hi-vis-hombre-mlarga.jpg', url: '/10-hombre' },
  { id: 3, img: 'https://tworldstore.cl/2618-home_default/parka-termica-light-ml-hombre.jpg', url: '/productos' },
  { id: 4, img: 'https://tworldstore.cl/239-home_default/botin-de-seguridad-edimburgo.jpg', url: '/12-calzado' },
  { id: 5, img: 'https://tworldstore.cl/2600-home_default/parka-softshell-mujer.jpg', url: '/11-mujer' },
]

export const categories = [
  { id: 1, title: 'PRODUCTOS CERTIFICADOS', img: 'https://tworldstore.cl/stupload/stswiper/calugas-264x190.png', slug: 'certificados' },
  { id: 2, title: 'PANTALONES Y JEANS', img: 'https://tworldstore.cl/stupload/stswiper/calugas-264x190-04.png', slug: 'pantalones' },
  { id: 3, title: 'CAMISAS Y BLUSAS', img: 'https://tworldstore.cl/stupload/stswiper/calugas-264x190-03.png', slug: 'camisas' },
  { id: 4, title: 'PARKAS Y CHAQUETAS', img: 'https://tworldstore.cl/stupload/stswiper/calugas-264x190-05.png', slug: 'parkas' },
  { id: 5, title: 'POLERAS Y POLERONES', img: 'https://tworldstore.cl/stupload/stswiper/calugas-264x190-01.png', slug: 'poleras' },
  { id: 6, title: 'CALZADO DE SEGURIDAD', img: 'https://tworldstore.cl/239-home_default/botin-de-seguridad-edimburgo.jpg', slug: '12-calzado' },
]

// Datos Base
const baseProducts = [
  {
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
  },
  {
    id: 827,
    slug: 'parka-termica-light-ml-hombre',
    name: 'PARKA TÉRMICA LIGHT M/L HOMBRE',
    sku: '08341',
    price: 22490,
    image: 'https://tworldstore.cl/2618-home_default/parka-termica-light-ml-hombre.jpg',
    hoverImage: 'https://tworldstore.cl/2617-home_default/parka-termica-light-ml-hombre.jpg',
    category: '10-hombre',
    isOnSale: true,
    maxSize: 'XXXL',
    hasEmbroidery: true,
    colors: [{ name: 'NEGRO', hex: '#000000' }, { name: 'GRIS', hex: '#b0afb5' }, { name: 'ROJO', hex: '#e12f31' }]
  },
  {
    id: 967,
    slug: 'jeans-practical-line-100-algodon-hombre',
    name: 'Jeans Practical Line 100% Algodón Hombre',
    sku: '10201',
    price: 12590,
    image: 'https://tworldstore.cl/6312-home_default/jeans-practical-line-100-algodon-hombre.jpg',
    hoverImage: 'https://tworldstore.cl/6313-home_default/jeans-practical-line-100-algodon-hombre.jpg',
    category: '10-hombre',
    isOnSale: true,
    maxSize: '60',
    colors: [{ name: 'AZUL', hex: '#032089' }]
  },
  {
    id: 825,
    slug: 'parka-softshell-mujer',
    name: 'PARKA SOFTSHELL MUJER',
    sku: '08345',
    price: 26990,
    image: 'https://tworldstore.cl/2600-home_default/parka-softshell-mujer.jpg',
    hoverImage: 'https://tworldstore.cl/2601-home_default/parka-softshell-mujer.jpg',
    category: '11-mujer',
    isFeatured: true,
    maxSize: 'XXL',
    colors: [{ name: 'ROJO', hex: '#e12f31' }, { name: 'NEGRO', hex: '#000000' }]
  },
  {
    id: 1002,
    slug: 'botin-seguridad-edimburgo',
    name: 'Botín de Seguridad Edimburgo',
    sku: '03001',
    price: 34990,
    image: 'https://tworldstore.cl/239-home_default/botin-de-seguridad-edimburgo.jpg',
    hoverImage: 'https://tworldstore.cl/240-home_default/botin-de-seguridad-edimburgo.jpg',
    category: '12-calzado',
    isFeatured: true,
    colors: [{ name: 'CAFE', hex: '#654321' }]
  },
  {
    id: 1003,
    slug: 'zapato-seguridad-tracker',
    name: 'Zapato de Seguridad Tracker',
    sku: '03005',
    price: 28990,
    image: 'https://tworldstore.cl/251-home_default/zapato-de-seguridad-tracker.jpg',
    hoverImage: 'https://tworldstore.cl/252-home_default/zapato-de-seguridad-tracker.jpg',
    category: '12-calzado',
    isFeatured: true,
    colors: [{ name: 'NEGRO', hex: '#000000' }]
  }
];

// Generador de datos para rellenar las categorías y probar el catálogo B2B
const generateMockProducts = () => {
  const generated = [...baseProducts];
  const categoriesToPopulate = ['10-hombre', '11-mujer', '12-calzado', '9-lineas', 'epp'];
  
  let idCounter = 2000;

  categoriesToPopulate.forEach(cat => {
    // Generar 15 productos por categoría para simular un catálogo lleno
    for(let i=0; i<15; i++) {
      let name = '';
      let price = 0;
      let img = 'https://tworldstore.cl/img/logo-1768940542.jpg'; // fallback
      
      if (cat === '10-hombre') {
        name = `Pantalón Cargo Hombre Mod. ${i}`; price = 15990 + (i*1000);
        img = 'https://tworldstore.cl/6204-home_default/pantalon-ignifugo-antiestatico-technic-hombre-100-alg.jpg';
      } else if (cat === '11-mujer') {
        name = `Blusa Ejecutiva Manga Corta Mod. ${i}`; price = 12990 + (i*500);
        img = 'https://tworldstore.cl/2600-home_default/parka-softshell-mujer.jpg';
      } else if (cat === '12-calzado') {
        name = `Calzado Dieléctrico Pro ${i}`; price = 35990 + (i*2000);
        img = 'https://tworldstore.cl/239-home_default/botin-de-seguridad-edimburgo.jpg';
      } else if (cat === '9-lineas') {
        name = `Vestuario Industrial Línea Iron ${i}`; price = 25000 + (i*1500);
        img = 'https://tworldstore.cl/2618-home_default/parka-termica-light-ml-hombre.jpg';
      } else if (cat === 'epp') {
        name = `Casco de Seguridad Certificado V${i}`; price = 8990 + (i*500);
        img = 'https://tworldstore.cl/stupload/stswiper/calugas-264x190.png';
      }

      generated.push({
        id: idCounter++,
        slug: name.toLowerCase().replace(/ /g, '-').replace(/\./g, ''),
        name: name,
        sku: `99${cat.substring(0,2)}${i}`,
        price: price,
        image: img,
        category: cat,
        colors: [{ name: 'ESTÁNDAR', hex: '#555555' }],
        variants: [
          { size: 'M', stock: 10 }, { size: 'L', stock: 15 }
        ]
      });
    }
  });

  return generated;
};

export const products = generateMockProducts();
