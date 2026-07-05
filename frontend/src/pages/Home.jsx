import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/catalog/ProductCard'
import { products } from '../utils/productsData'
import { twImg } from '../utils/imgUrl'

const FALLBACK = '/icons/logo_maisi.jpeg'
const HERO_BANNERS = [
  {
    id: 'maisi-bordado',
    img: '/icons/foto2.png',
    url: '/cotizacion',
    alt: 'Bordados corporativos premium Maisi',
    badge: 'Bordados premium',
    title: 'Uniformes y accesorios que elevan tu marca',
    text: 'Cotiza bordados corporativos con presencia visual, terminación prolija y prendas listas para destacar en terreno.',
    cta: 'Cotizar proyecto',
    imageClass: 'object-cover object-center',
    overlayClass: 'bg-gradient-to-r from-black/72 via-black/46 to-black/18',
    panelClass: 'max-w-xl'
  },
  {
    id: 'maisi-catalogo',
    img: '/icons/foto1.png',
    url: '/productos',
    alt: 'Catálogo de prendas bordadas Maisi',
    badge: 'Catálogo corporativo',
    title: 'Bordamos tu identidad',
    text: 'Tu marca, tu logo, tu presencia — cosidos con precisión en cada prenda para que tu equipo hable por sí solo.',
    cta: 'Ver catálogo',
    imageClass: 'object-cover object-center',
    overlayClass: 'bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-black/10',
    panelClass: 'max-w-lg'
  },
]


const CATEGORY_CARDS = [
  { title: 'HOMBRE', img: 'https://tworldstore.cl/stupload/stswiper/calugas-264x190-01.png', slug: '10-hombre' },
  { title: 'MUJER', img: 'https://tworldstore.cl/stupload/stswiper/calugas-264x190-03.png', slug: '11-mujer' },
  { title: 'CALZADO DE SEGURIDAD', img: 'https://tworldstore.cl/6541-large_default/botin-skechers-seguridad-ledom-hombre.jpg', slug: '12-calzado' },
]

const VALUE_PROPS = [
  {
    title: 'Vestuario Premium',
    text: 'Prendas y terminaciones pensadas para soportar uso intensivo sin perder presencia.',
    metric: 'Acabado prolijo'
  },
  {
    title: 'Bordado Profesional',
    text: 'Aplicamos identidad de marca con definición, contraste y lectura clara en cada prenda.',
    metric: 'Imagen consistente'
  },
  {
    title: 'Entrega Confiable',
    text: 'Coordinamos producción y despacho para responder con tiempos claros y seguimiento.',
    metric: 'Cobertura nacional'
  }
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
      setCurrentSlide(prev => (prev + 1) % HERO_BANNERS.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const maxCarousel = Math.max(0, featuredProducts.length - CARDS_VISIBLE)

  return (
    <div className="w-full">

      {/* ── Hero Banner Slider ── */}
      <section className="relative w-full overflow-hidden bg-slate-950" style={{ minHeight: 460 }}>
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {HERO_BANNERS.map((banner) => (
            <div key={banner.id} className="relative w-full min-h-[460px] sm:min-h-[540px] lg:min-h-[620px] flex-shrink-0">
              <Link to={banner.url}>
                <img
                  src={banner.img.startsWith('/icons/') ? banner.img : twImg(banner.img)}
                  alt={banner.alt}
                  loading="eager"
                  className={`absolute inset-0 w-full h-full ${banner.imageClass}`}
                  onError={(e) => { e.currentTarget.src = FALLBACK }}
                />
                <div className={`absolute inset-0 ${banner.overlayClass}`} />
                <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="relative z-10 flex min-h-[460px] items-end px-4 py-6 sm:min-h-[540px] sm:px-8 sm:py-8 lg:min-h-[620px] lg:px-16 lg:py-12">
                  <div className={`${banner.panelClass} rounded-[1.75rem] border border-white/12 bg-black/42 p-5 shadow-2xl backdrop-blur-md sm:p-7 lg:p-8`}>
                    <span className="inline-flex rounded-full border border-[#ff7a00]/40 bg-[#ff7a00]/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#ffd2a6] sm:text-xs">
                      {banner.badge}
                    </span>
                    <h1 className="mt-4 text-[1.85rem] font-black uppercase leading-[0.95] text-white sm:text-4xl lg:text-[3.35rem]">
                      {banner.title}
                    </h1>
                    <p className="mt-3 max-w-lg text-sm leading-6 text-white/82 sm:mt-4 sm:text-base">
                      {banner.text}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-white sm:mt-6 sm:text-sm">
                      {banner.cta}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14"/>
                        <path d="m13 5 7 7-7 7"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Arrows */}
        <button
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/18 hover:bg-white/45 text-white w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition z-10"
          onClick={() => setCurrentSlide(currentSlide === 0 ? HERO_BANNERS.length - 1 : currentSlide - 1)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/18 hover:bg-white/45 text-white w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition z-10"
          onClick={() => setCurrentSlide((currentSlide + 1) % HERO_BANNERS.length)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 sm:bottom-5">
          {HERO_BANNERS.map((_, i) => (
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

      {/* ── Valor Diferencial ── */}
      <section className="bg-slate-950 py-12 sm:py-14">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-800 shadow-[0_30px_80px_rgba(15,23,42,0.28)]">
            <img
              src="/icons/foto2.png"
              alt="Proceso y resultado de bordado Maisi"
              className="absolute inset-0 h-full w-full object-cover object-center"
              onError={(e) => { e.currentTarget.src = FALLBACK }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,15,35,0.92)_0%,rgba(8,15,35,0.82)_38%,rgba(8,15,35,0.52)_62%,rgba(8,15,35,0.68)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.16),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),_transparent_28%)]" />

            <div className="relative z-10 flex min-h-[360px] items-end lg:min-h-[420px]">
              <div className="grid w-full gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.72fr)] lg:items-end lg:p-10">
                <div className="max-w-3xl">
                  <span className="inline-flex rounded-full border border-orange-400/30 bg-orange-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-orange-200">
                    Bordado corporativo
                  </span>
                  <h2 className="mt-4 max-w-2xl text-3xl font-black uppercase leading-tight text-white sm:text-4xl lg:text-[2.9rem]">
                    Por qué elegir a Maisi
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
                    Diseñamos soluciones de vestuario corporativo para empresas que necesitan presencia de marca, durabilidad operativa y una entrega confiable de principio a fin.
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {VALUE_PROPS.map((item) => (
                      <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-900/58 p-4 backdrop-blur-md">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-200">
                          {item.metric}
                        </p>
                        <h3 className="mt-2 text-xl font-bold text-white">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-200">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-200">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/55 px-4 py-2 backdrop-blur-sm">
                      <span className="h-2 w-2 rounded-full bg-orange-400" />
                      Personalización textil
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/55 px-4 py-2 backdrop-blur-sm">
                      <span className="h-2 w-2 rounded-full bg-sky-400" />
                      Producción con foco B2B
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/55 px-4 py-2 backdrop-blur-sm">
                      <span className="h-2 w-2 rounded-full bg-white" />
                      Despacho a todo Chile
                    </span>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-white/10 bg-black/45 p-5 backdrop-blur-md lg:justify-self-end">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-orange-200">
                    Imagen que vende
                  </p>
                  <p className="mt-3 text-2xl font-black uppercase leading-tight text-white lg:text-[2rem]">
                    Bordado que se nota, refuerza marca y transmite confianza.
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-100">
                    Aplicamos tu identidad en gorras, polos y chaquetas técnicas con una estética cuidada para ventas, atención en terreno y uso diario.
                  </p>
                </div>
              </div>
            </div>
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
