import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/catalog/ProductCard'
import { banners } from '../utils/mockData'
import { products } from '../utils/productsData'
import { twImg } from '../utils/imgUrl'

const FALLBACK = '/icons/logo_maisi.jpeg'

// Líneas Tworld con sus colores e imágenes
const LINEAS = [
  { name: 'FREE ACTION LINE', color: '#888888', textColor: '#fff' },
  { name: 'HI-VIS LINE',      color: '#c9920a', textColor: '#fff' },
  { name: 'IRON LINE',        color: '#0a1040', textColor: '#fff' },
  { name: 'OUTWORK LINE',     color: '#9e8c6d', textColor: '#fff' },
  { name: 'PRACTICAL LINE',   color: '#dc2b2e', textColor: '#fff' },
  { name: 'TECHNIC LINE',     color: '#1a1a1a', textColor: '#fff' },
  { name: 'ADVANCE LINE',     color: '#555555', textColor: '#fff' },
]

const CATEGORY_CARDS = [
  { title: 'HOMBRE', img: 'https://tworldstore.cl/stupload/stswiper/calugas-264x190-01.png', slug: '10-hombre' },
  { title: 'MUJER', img: 'https://tworldstore.cl/stupload/stswiper/calugas-264x190-03.png', slug: '11-mujer' },
  { title: 'EPP', img: 'https://tworldstore.cl/stupload/stswiper/calugas-264x190.png', slug: 'epp' },
  { title: 'CALZADO DE SEGURIDAD', img: 'https://tworldstore.cl/239-home_default/botin-de-seguridad-edimburgo.jpg', slug: '12-calzado' },
  { title: 'VESTUARIO / LÍNEAS', img: 'https://tworldstore.cl/stupload/stswiper/calugas-264x190-04.png', slug: '9-lineas' },
]

export default function Home() {
  // Use first 15 products as featured
  const featuredProducts = products.slice(0, 15)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const CARDS_VISIBLE = 5

  // Hero auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const maxCarousel = Math.max(0, featuredProducts.length - CARDS_VISIBLE)

  return (
    <div className="w-full">

      {/* ── Hero Banner Slider ── */}
      <section className="relative w-full overflow-hidden bg-gray-900" style={{ height: 600 }}>
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="w-full h-full flex-shrink-0">
              <Link to={banner.url}>
                <img
                  src={twImg(banner.img)}
                  alt="Banner"
                  loading="eager"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = FALLBACK }}
                />
              </Link>
            </div>
          ))}
        </div>

        {/* Arrows */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/50 text-white w-10 h-10 flex items-center justify-center rounded-full transition z-10"
          onClick={() => setCurrentSlide(currentSlide === 0 ? banners.length - 1 : currentSlide - 1)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/50 text-white w-10 h-10 flex items-center justify-center rounded-full transition z-10"
          onClick={() => setCurrentSlide((currentSlide + 1) % banners.length)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
        </button>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full transition-colors border-2 ${
                currentSlide === i ? 'bg-accent border-accent' : 'bg-transparent border-white'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ── Categorías ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {CATEGORY_CARDS.map((cat) => (
            <Link
              key={cat.slug}
              to={`/${cat.slug}`}
              className="relative aspect-[4/3] overflow-hidden group border border-border rounded shadow-sm"
            >
              <img
                src={twImg(cat.img)}
                alt={cat.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => { e.currentTarget.src = FALLBACK }}
              />
              <div className="absolute inset-0 bg-black/35 group-hover:bg-black/50 transition-colors flex items-end justify-center pb-4">
                <span className="text-white font-bold text-xs text-center px-2 uppercase leading-tight tracking-wider">
                  {cat.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Productos Destacados ── */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Título con separador */}
          <div className="flex items-center justify-center mb-10">
            <div className="flex-1 h-px bg-border"/>
            <h2 className="mx-6 font-display text-[26px] font-bold text-primary uppercase tracking-wide whitespace-nowrap">
              PRODUCTOS DESTACADOS
            </h2>
            <div className="flex-1 h-px bg-border"/>
          </div>

          {/* Carousel con flechas a los costados */}
          <div className="relative flex items-center">
            {/* Flecha izquierda */}
            <button
              onClick={() => setCarouselIndex(Math.max(0, carouselIndex - 1))}
              disabled={carouselIndex === 0}
              className="shrink-0 w-10 h-10 border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition mr-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            </button>

            {/* Cards window */}
            <div className="flex-1 overflow-hidden">
              <div
                className="flex gap-4 transition-transform duration-300"
                style={{ transform: `translateX(-${carouselIndex * (100 / CARDS_VISIBLE)}%)` }}
              >
                {featuredProducts.map(product => (
                  <div key={product.id} className="flex-shrink-0" style={{ width: `calc(${100 / CARDS_VISIBLE}% - 13px)` }}>
                    <ProductCard product={product}/>
                  </div>
                ))}
              </div>
            </div>

            {/* Flecha derecha */}
            <button
              onClick={() => setCarouselIndex(Math.min(maxCarousel, carouselIndex + 1))}
              disabled={carouselIndex >= maxCarousel}
              className="shrink-0 w-10 h-10 border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition ml-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── Sección Líneas (grid visual) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: '1fr 1fr', gridTemplateRows: '300px 300px',
            gridTemplateAreas: '"outwork hivis" "outwork technic"' }}
        >
          {/* OUTWORK */}
          <Link
            to="/9-lineas"
            className="relative overflow-hidden group rounded shadow-sm"
            style={{ gridArea: 'outwork' }}
          >
            <img src={twImg('https://tworldstore.cl/stupload/stbanner/lineas-inferiores-01.png')} alt="Outwork Line"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => { e.currentTarget.src = FALLBACK }}
            />
            <div className="absolute inset-0 bg-black/35"/>
            <div className="absolute bottom-6 left-6">
              <p className="text-white font-bold text-2xl leading-tight"><span className="font-black">OUTWORK</span> <span className="font-light">LINE</span></p>
            </div>
          </Link>

          {/* HI-VIS */}
          <Link
            to="/9-lineas"
            className="relative overflow-hidden group rounded shadow-sm"
            style={{ gridArea: 'hivis' }}
          >
            <img src={twImg('https://tworldstore.cl/stupload/stbanner/lineas-inferiores-02.png')} alt="Hi-Vis Line"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => { e.currentTarget.src = FALLBACK }}
            />
            <div className="absolute inset-0 bg-[#c9920a]/40"/>
            <div className="absolute bottom-6 left-6">
              <p className="text-white font-bold text-2xl leading-tight"><span className="font-black">HI-VIS</span> <span className="font-light">LINE</span></p>
            </div>
          </Link>

          {/* TECHNIC */}
          <Link
            to="/9-lineas"
            className="relative overflow-hidden group rounded shadow-sm"
            style={{ gridArea: 'technic' }}
          >
            <img src={twImg('https://tworldstore.cl/stupload/stbanner/lineas-inferiores-03.png')} alt="Technic Line"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => { e.currentTarget.src = FALLBACK }}
            />
            <div className="absolute inset-0 bg-black/45"/>
            <div className="absolute bottom-6 left-6">
              <p className="text-white font-bold text-2xl leading-tight"><span className="font-black">TECHNIC</span> <span className="font-light">LINE</span></p>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Nuestras Líneas (badges) ── */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-display text-[28px] font-bold text-primary uppercase mb-8 tracking-wide">
            NUESTRAS LÍNEAS
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {LINEAS.map((l) => (
              <Link
                key={l.name}
                to={`/productos?linea=${l.name.toLowerCase().replace(' line', '').replace(' ', '-')}`}
                className="px-5 py-3 font-bold text-sm uppercase tracking-widest transition-opacity hover:opacity-80 rounded"
                style={{ backgroundColor: l.color, color: l.textColor }}
              >
                {l.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Valor Diferencial ── */}
      <section className="bg-primary text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold mb-12 uppercase">Por qué elegir a Maisi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
                title: 'Vestuario Premium',
                text: 'Productos de excelente calidad para el trabajo del día a día, durables y cómodos.'
              },
              {
                icon: <><path d="m18 14 4-4"/><path d="m14 18-4 4"/><path d="m2 22 2-2"/><path d="M22 2 12 12"/><path d="M11 22 2 13"/><path d="M2 2l20 20"/></>,
                title: 'Servicio de Bordado',
                text: 'Personaliza tus prendas corporativas con nuestro servicio de bordado de alta fidelidad.'
              },
              {
                icon: <><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></>,
                title: 'Despacho Rápido',
                text: 'Enviamos tus pedidos a todo Chile de forma rápida y segura.'
              }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {item.icon}
                  </svg>
                </div>
                <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                <p className="text-white/80 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WhatsApp Flotante ── */}
      <a
        href="https://wa.me/56957025456"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-[#1ebe5d] transition-colors"
        title="Contáctenos por WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
        </svg>
      </a>

    </div>
  )
}
