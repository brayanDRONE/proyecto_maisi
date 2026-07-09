import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { products } from '../utils/productsData'
import { useCart } from '../hooks/useCart'

const CATEGORY_LABELS = {
  '10-hombre': 'Hombre',
  '11-mujer': 'Mujer',
  'epp': 'EPP',
  '9-lineas': 'Líneas',
}

// Attributes/icons to show for products
const ATTRIBUTES = [
  { key: 'antipilling', label: 'ANTIPILLING', icon: '⟨|||⟩' },
  { key: 'durable', label: 'DURABLE', icon: '🛡' },
  { key: 'estabilidad', label: 'ESTABILIDAD DIMENSIONAL', icon: '⊠' },
  { key: 'solidez', label: 'SOLIDEZ DE COLOR POR LUZ', icon: '☀' },
]

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [selectedColor, setSelectedColor] = useState(null)
  const [quantities, setQuantities] = useState({})
  const [activeImage, setActiveImage] = useState(0)
  const [descOpen, setDescOpen] = useState(true)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [fichasOpen, setFichasOpen] = useState(false)
  const [addedMsg, setAddedMsg] = useState('')
  const timerRef = useRef(null)

  useEffect(() => {
    const found = slug
      ? products.find(p => p.slug === slug || p.id === slug || p.sku === slug)
      : products[0]
    setProduct(found || null)
    if (found) {
      // Related: same category, different product
      const rel = products
        .filter(p => p.category === found.category && p.id !== found.id)
        .slice(0, 6)
      setRelated(rel)
      setActiveImage(0)
      setQuantities({})
      if (Array.isArray(found.colors) && found.colors.length > 0) {
        setSelectedColor(found.colors[0])
      } else {
        setSelectedColor({ name: 'N/D', hex: '#cccccc' })
      }
    }
  }, [slug])

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-2">Producto no encontrado</h2>
          <Link to="/productos" className="text-primary underline">Ver todos los productos</Link>
        </div>
      </div>
    )
  }

  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image]
  const availableColors = Array.isArray(product.colors) && product.colors.length > 0
    ? product.colors
    : [{ name: 'N/D', hex: '#cccccc' }]
  const totalQty = Object.values(quantities).reduce((a, b) => a + b, 0)

  // Active price tier based on quantity
  let activePrice = product.price
  if (product.volumePricing && product.volumePricing.length > 0) {
    const applicable = [...product.volumePricing]
      .reverse()
      .find(t => totalQty >= t.minQuantity)
    if (applicable) activePrice = applicable.price
  }

  const formatPrice = (p) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(p)

  const handleQtyChange = (size, delta) => {
    setQuantities(prev => {
      const cur = prev[size] || 0
      const next = Math.max(0, cur + delta)
      if (next === 0) {
        const copy = { ...prev }
        delete copy[size]
        return copy
      }
      return { ...prev, [size]: next }
    })
  }

  const handleAddToCart = () => {
    if (totalQty === 0) {
      setAddedMsg('⚠ Selecciona al menos una cantidad')
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setAddedMsg(''), 3000)
      return
    }
    Object.entries(quantities).forEach(([size, qty]) => {
      addToCart({
        ...product,
        selectedSize: size,
        selectedColor: selectedColor.name,
        quantity: qty,
        price: activePrice,
      })
    })
    setAddedMsg(`✓ ${totalQty} producto(s) añadidos al carrito`)
    setQuantities({})
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setAddedMsg(''), 4000)
  }

  // Clean fullDesc: remove trailing "Lee masShow less"
  const cleanDesc = (product.fullDesc || product.shortDesc || '')
    .replace(/Lee masShow less/g, '')
    .replace(/Lee mas/g, '')
    .trim()

  return (
    <div className="bg-white min-h-screen pb-16">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-border py-2.5 text-xs text-text-light">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center gap-1">
          <Link to="/" className="hover:text-primary transition-colors">INICIO</Link>
          <span className="mx-1">›</span>
          <Link to={`/${product.category}`} className="hover:text-primary transition-colors uppercase">
            {CATEGORY_LABELS[product.category] || product.category}
          </Link>
          <span className="mx-1">›</span>
          <span className="text-text font-medium uppercase truncate max-w-[300px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* ===== LEFT: Image Gallery ===== */}
          <div>
            {/* Main image with watermark */}
            <div className="relative border border-border rounded-md overflow-hidden bg-white mb-4 aspect-square max-h-[500px]">
              <img
                src={gallery[activeImage] || product.image}
                alt={product.name}
                className="w-full h-full object-contain"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/500?text=Sin+imagen' }}
              />
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-5">
                <img src="https://tworldstore.cl/img/logo-1768940542.jpg" alt="" className="w-64 h-64 object-contain" />
              </div>
            </div>

            {/* Thumbnails */}
            {gallery.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 border-2 rounded overflow-hidden transition-all ${idx === activeImage ? 'border-primary shadow-md' : 'border-border opacity-70 hover:opacity-100'}`}
                  >
                    <img
                      src={img}
                      alt={`Vista ${idx + 1}`}
                      className="w-full h-full object-contain"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Attributes section */}
            <div className="mt-10">
              <h3 className="text-primary font-bold text-center text-lg uppercase tracking-widest mb-4">ATRIBUTOS</h3>
              <div className="grid grid-cols-4 gap-3">
                {ATTRIBUTES.map(attr => (
                  <div key={attr.key} className="border border-border rounded-md p-2 flex flex-col items-center text-center">
                    <span className="text-xl mb-1">{attr.icon}</span>
                    <span className="text-[9px] font-bold uppercase leading-tight">{attr.label}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-primary font-bold text-center text-lg uppercase tracking-widest mt-6 mb-3">TECNOLOGÍAS</h3>
              <div className="flex justify-center">
                <div className="border border-border rounded-md p-4 flex flex-col items-center text-center w-24">
                  <span className="text-2xl mb-1">☀</span>
                  <span className="text-[9px] font-bold uppercase">PROTECCIÓN UV</span>
                </div>
              </div>
            </div>
          </div>

          {/* ===== RIGHT: Product Info ===== */}
          <div>
            {/* Title */}
            <h1 className="font-display text-2xl md:text-3xl font-bold uppercase leading-tight mb-3">
              {product.name}
            </h1>

            {/* Short description */}
            {product.shortDesc && (
              <p className="text-sm text-text-light mb-5 leading-relaxed">
                {product.shortDesc.replace(/Lee masShow less|Lee mas/g, '').trim()}
              </p>
            )}

            {/* Price tiers */}
            {product.volumePricing && product.volumePricing.length > 0 ? (
              <div className="mb-6 space-y-1">
                {product.volumePricing.map((tier, i) => {
                  const isActive = totalQty >= tier.minQuantity &&
                    (!product.volumePricing[i + 1] || totalQty < product.volumePricing[i + 1].minQuantity)
                  return (
                    <div key={i} className={`flex items-baseline gap-3 py-1 px-2 rounded transition-colors ${isActive ? 'bg-primary/5 border-l-4 border-primary' : ''}`}>
                      <span className={`text-2xl font-bold ${isActive ? 'text-primary' : 'text-text'}`}>
                        {formatPrice(tier.price)}
                      </span>
                      <span className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-text-light'}`}>
                        {tier.label === 'C/U' ? 'C/U' : tier.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="mb-6">
                <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
              </div>
            )}

            {/* SKU */}
            <p className="text-xs text-text mb-4">
              <strong>Referencia: SKU {product.sku}</strong>
            </p>

            {/* Color selector */}
            <div className="mb-5">
              <p className="text-sm font-bold uppercase mb-2">
                Seleccione Color: <span className="text-primary">{selectedColor?.name || 'N/D'}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {availableColors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    title={color.name}
                    className={`w-9 h-9 rounded-full border-2 transition-all duration-150 shadow-sm ${
                      selectedColor?.name === color.name
                        ? 'border-primary scale-115 shadow-md ring-2 ring-primary/30'
                        : 'border-gray-300 hover:scale-110'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Size guide link */}
            <button className="text-xs text-white bg-primary px-4 py-2 rounded hover:bg-primary/90 transition-colors mb-5">
              Ver guía de tallas
            </button>

            {/* Variants table */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6 border border-border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-xs font-bold uppercase">TALLA</th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold uppercase hidden sm:table-cell">CÓDIGO</th>
                      <th className="px-4 py-2.5 text-left text-xs font-bold uppercase hidden sm:table-cell">COLOR</th>
                      <th className="px-4 py-2.5 text-center text-xs font-bold uppercase">CANTIDAD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {product.variants.map((v, idx) => (
                      <tr key={idx} className={`hover:bg-gray-50 transition-colors ${quantities[v.size] > 0 ? 'bg-blue-50' : ''}`}>
                        <td className="px-4 py-2.5 font-bold text-text">{v.size}</td>
                        <td className="px-4 py-2.5 text-text-light text-xs hidden sm:table-cell">
                          {product.sku}{String(idx).padStart(2, '0')}
                        </td>
                        <td className="px-4 py-2.5 text-text-light text-xs hidden sm:table-cell uppercase">
                          {selectedColor?.name || 'N/D'}
                        </td>
                        <td className="px-4 py-2.5">
                          {v.stock === 0 ? (
                            <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-1 rounded">
                              Próximamente
                            </span>
                          ) : (
                            <div className="flex items-center justify-center gap-2 w-28 mx-auto border border-border rounded bg-white">
                              <button
                                onClick={() => handleQtyChange(v.size, -1)}
                                disabled={!quantities[v.size]}
                                className="px-2.5 py-1.5 text-text hover:bg-gray-100 disabled:opacity-30 transition-colors font-medium"
                              >
                                -
                              </button>
                              <span className="w-6 text-center text-sm font-bold select-none">
                                {quantities[v.size] || 0}
                              </span>
                              <button
                                onClick={() => handleQtyChange(v.size, 1)}
                                className="px-2.5 py-1.5 text-text hover:bg-gray-100 transition-colors font-medium"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Total qty summary */}
            {totalQty > 0 && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800 flex justify-between">
                <span>Precio unitario: <strong>{formatPrice(activePrice)}</strong></span>
                <span>Total: <strong>{formatPrice(activePrice * totalQty)}</strong></span>
              </div>
            )}

            {/* Feedback message */}
            {addedMsg && (
              <div className={`mb-4 p-3 rounded-md text-sm font-medium ${addedMsg.startsWith('✓') ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-yellow-100 text-yellow-800 border border-yellow-300'}`}>
                {addedMsg}
              </div>
            )}

            {/* Add to cart button */}
            <button
              onClick={handleAddToCart}
              className="w-full py-4 bg-gray-900 text-white font-bold uppercase tracking-widest text-sm rounded-md hover:bg-primary transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
              </svg>
              AÑADIR AL CARRITO {totalQty > 0 && `(${totalQty})`}
            </button>
          </div>
        </div>

        {/* ===== Description & Details accordion ===== */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left placeholder for additional photos */}
          <div />

          {/* Right: accordion */}
          <div className="space-y-1">
            {/* DESCRIPCIÓN */}
            <div className="border border-border rounded-md overflow-hidden">
              <button
                onClick={() => setDescOpen(o => !o)}
                className="w-full flex items-center justify-between px-5 py-4 text-sm font-bold uppercase text-left hover:bg-gray-50 transition-colors"
              >
                <span>DESCRIPCIÓN</span>
                <span className="text-xl font-light">{descOpen ? '−' : '+'}</span>
              </button>
              {descOpen && (
                <div className="px-5 pb-5 text-sm text-text leading-relaxed whitespace-pre-line border-t border-border">
                  {cleanDesc || 'Sin descripción disponible.'}
                </div>
              )}
            </div>

            {/* DETALLES DEL PRODUCTO */}
            <div className="border border-border rounded-md overflow-hidden">
              <button
                onClick={() => setDetailsOpen(o => !o)}
                className="w-full flex items-center justify-between px-5 py-4 text-sm font-bold uppercase text-left hover:bg-gray-50 transition-colors"
              >
                <span>DETALLES DEL PRODUCTO</span>
                <span className="text-xl font-light">{detailsOpen ? '−' : '+'}</span>
              </button>
              {detailsOpen && (
                <div className="px-5 pb-5 text-sm text-text border-t border-border">
                  <table className="w-full mt-3">
                    <tbody className="divide-y divide-border">
                      <tr><td className="py-2 font-bold w-1/2">SKU</td><td>{product.sku}</td></tr>
                      <tr><td className="py-2 font-bold">Categoría</td><td>{product.categoryLabel}</td></tr>
                      {product.url && <tr><td className="py-2 font-bold">Referencia</td><td><a href={product.url} target="_blank" rel="noopener noreferrer" className="text-primary underline text-xs">Ver en tienda oficial</a></td></tr>}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* FICHAS Y CERTIFICACIONES */}
            <div className="border border-border rounded-md overflow-hidden">
              <button
                onClick={() => setFichasOpen(o => !o)}
                className="w-full flex items-center justify-between px-5 py-4 text-sm font-bold uppercase text-left hover:bg-gray-50 transition-colors"
              >
                <span>FICHAS Y CERTIFICACIONES</span>
                <span className="text-xl font-light">{fichasOpen ? '−' : '+'}</span>
              </button>
              {fichasOpen && (
                <div className="px-5 pb-5 text-sm text-text-light border-t border-border pt-4">
                  Información de certificaciones disponible próximamente.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== También podría gustarte ===== */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold uppercase mb-6 border-b border-border pb-3">
              TAMBIÉN PODRÍA GUSTARTE
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
              {related.map(rel => (
                <Link
                  key={rel.id}
                  to={`/productos/${rel.slug}`}
                  className="flex-shrink-0 w-44 group"
                >
                  <div className="border border-border rounded-md overflow-hidden h-44 bg-gray-50 mb-2 group-hover:shadow-md transition-shadow">
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/176?text=N/A' }}
                    />
                  </div>
                  <p className="text-xs font-bold uppercase text-center line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                    {rel.name}
                  </p>
                  <p className="text-xs text-primary font-bold text-center mt-1">
                    {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(rel.price)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
