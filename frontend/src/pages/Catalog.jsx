import React, { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { products, catalogCategories } from '../utils/productsData'
import ProductCard from '../components/catalog/ProductCard'
import { twImg } from '../utils/imgUrl'

const FALLBACK = '/icons/logo_maisi.jpeg'

const CATEGORY_META = {
  '10-hombre': {
    label: 'Hombre',
    banner: 'https://tworldstore.cl/img/cms/fotos-home/Hombre.jpg',
    fallbackBanner: 'https://tworldstore.cl/stupload/stswiper/calugas-264x190-01.png',
  },
  '11-mujer': {
    label: 'Mujer',
    banner: 'https://tworldstore.cl/img/cms/fotos-home/Mujer.jpg',
    fallbackBanner: 'https://tworldstore.cl/stupload/stswiper/calugas-264x190-03.png',
  },
  'epp': {
    label: 'EPP',
    banner: 'https://tworldstore.cl/img/cms/fotos-home/EPP.jpg',
    fallbackBanner: 'https://tworldstore.cl/stupload/stswiper/calugas-264x190.png',
  },
  '12-calzado': {
    label: 'Calzado de Seguridad',
    banner: 'https://tworldstore.cl/img/cms/fotos-home/Calzado.jpg',
    fallbackBanner: 'https://tworldstore.cl/239-home_default/botin-de-seguridad-edimburgo.jpg',
  },
  '9-lineas': {
    label: 'Líneas',
    banner: 'https://tworldstore.cl/img/cms/fotos-home/Lineas.jpg',
    fallbackBanner: 'https://tworldstore.cl/stupload/stswiper/calugas-264x190-04.png',
  },
}

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'name-asc', label: 'Nombre: A-Z' },
]

const PAGE_SIZE = 12

export default function Catalog() {
  const { categoryId } = useParams()
  const [sort, setSort] = useState('relevance')
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const [bannerError, setBannerError] = useState(false)

  const meta = categoryId ? CATEGORY_META[categoryId] : null

  const filtered = useMemo(() => {
    let list = categoryId
      ? products.filter(p => p.category === categoryId)
      : products

    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    else if (sort === 'name-asc') list = [...list].sort((a, b) => a.name.localeCompare(b.name))

    return list
  }, [categoryId, sort])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSortChange = (val) => {
    setSort(val)
    setPage(1)
  }

  const bannerSrc = meta
    ? (bannerError ? meta.fallbackBanner : meta.banner)
    : 'https://tworldstore.cl/stupload/stswiper/lofty2.png'

  const resolvedBannerSrc = twImg(bannerSrc)

  return (
    <div className="bg-white min-h-screen pb-16">
      {/* Banner de categoría */}
      <div className="relative h-36 md:h-48 overflow-hidden bg-gray-200">
        <img
          src={resolvedBannerSrc}
          alt={meta?.label || 'Productos'}
          loading="eager"
          className="w-full h-full object-cover"
          onError={(e) => {
            if (!bannerError) { setBannerError(true); return }
            e.currentTarget.src = FALLBACK
          }}
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="font-display text-white text-4xl md:text-5xl font-bold uppercase tracking-widest drop-shadow-lg">
            {meta?.label || 'Todos los Productos'}
          </h1>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-border py-2 text-xs text-text-light">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1">
          <Link to="/" className="hover:text-primary">Inicio</Link>
          {categoryId && (
            <>
              <span>›</span>
              <span className="text-text font-medium">{meta?.label || categoryId}</span>
            </>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            {/* Sort */}
            <select
              value={sort}
              onChange={e => handleSortChange(e.target.value)}
              className="border border-border rounded px-3 py-2 text-sm text-text bg-white focus:outline-none focus:border-primary"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* View mode */}
            <div className="flex border border-border rounded overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-text-light hover:bg-gray-50'}`}
                title="Vista cuadrícula"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-text-light hover:bg-gray-50'}`}
                title="Vista lista"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                  <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Pagination info */}
          <span className="text-sm text-text-light">
            {page}/{totalPages} — {filtered.length} productos
          </span>
        </div>

        {/* Category quick-nav if showing all */}
        {!categoryId && (
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(CATEGORY_META).map(([slug, m]) => (
              <Link
                key={slug}
                to={`/${slug}`}
                className="px-4 py-1.5 border border-border rounded-full text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-colors"
              >
                {m.label}
              </Link>
            ))}
          </div>
        )}

        {/* Products grid/list */}
        {paginated.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {paginated.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {paginated.map(product => (
                <ProductListRow key={product.id} product={product} />
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-text-light">No hay productos en esta categoría</h2>
            <Link to="/productos" className="mt-4 inline-block text-primary underline">Ver todos los productos</Link>
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-border rounded text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              ‹ Anterior
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pg = i + 1
              if (totalPages > 7) {
                if (page <= 4) pg = i + 1
                else if (page >= totalPages - 3) pg = totalPages - 6 + i
                else pg = page - 3 + i
              }
              return (
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  className={`w-9 h-9 rounded text-sm font-medium transition-colors ${page === pg ? 'bg-primary text-white' : 'border border-border hover:bg-gray-50'}`}
                >
                  {pg}
                </button>
              )
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-border rounded text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Siguiente ›
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// List row component for list view
function ProductListRow({ product }) {
  const formatPrice = (p) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(p)

  return (
    <Link
      to={`/productos/${product.slug}`}
      className="flex gap-4 border border-border rounded-md p-3 hover:shadow-md transition-shadow bg-white group"
    >
      <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=N/A' }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-sm uppercase text-text group-hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
        <p className="text-xs text-text-light mt-0.5">SKU {product.sku}</p>
        <p className="text-xs text-text-light mt-0.5 line-clamp-1">{product.shortDesc}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-primary font-bold text-lg">{formatPrice(product.price)}</div>
        {product.volumePricing && product.volumePricing.length > 1 && (
          <div className="text-xs text-text-light mt-1">
            {formatPrice(product.volumePricing[product.volumePricing.length - 1].price)} / 10+
          </div>
        )}
      </div>
    </Link>
  )
}
