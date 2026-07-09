import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { twImg, getImageWithFallback } from '../../utils/imgUrl'

const FALLBACK = '/icons/logo_maisi.jpeg'

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false)
  const { addToCart } = useCart()

  const rawPrimary = product.image || product.primary_image
  const rawSecondary = product.hoverImage || product.secondary_image || rawPrimary
  const primaryImage = twImg(rawPrimary) || FALLBACK
  const secondaryImage = twImg(rawSecondary) || primaryImage
  const primaryFallback = twImg(getImageWithFallback(rawPrimary)) || FALLBACK
  const slug           = product.slug || product.id

  // Colors: use standard colors if none provided
  const colors = product.colors || []

  // Sizes: last item = max size shown on card
  const sizes   = product.sizes || (product.variants ? product.variants.map(v => v.size) : [])
  const maxSize = sizes.length > 0 ? sizes[sizes.length - 1] : (product.maxSize || null)

  // Price tiers
  const lowestTierPrice = product.volumePricing && product.volumePricing.length > 1
    ? product.volumePricing[product.volumePricing.length - 1].price
    : null

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price)

  if (!primaryImage) {
    return (
      <div className="flex flex-col bg-gray-100 border border-border p-4 h-80 items-center justify-center">
        <span className="text-gray-400 text-sm">Sin imagen</span>
      </div>
    )
  }

  return (
    <div
      className="relative flex flex-col bg-white border border-border group overflow-hidden hover:shadow-lg transition-all duration-300 rounded-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen con hover */}
      <Link to={`/productos/${slug}`} className="relative block h-56 bg-white overflow-hidden flex-shrink-0">
        <img
          src={primaryImage}
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-contain absolute inset-0 transition-opacity duration-400 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
          onError={(e) => {
            // Try home_default version first, then fallback to logo
            if (!e.currentTarget.src.includes('-home_default')) {
              e.currentTarget.src = primaryFallback
            } else {
              e.currentTarget.src = FALLBACK
            }
          }}
        />
        <img
          src={secondaryImage}
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-contain absolute inset-0 transition-opacity duration-400 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          onError={(e) => { e.currentTarget.src = primaryImage }}
        />
      </Link>

      {/* Info */}
      <div className="flex-1 flex flex-col px-3 pt-3 pb-10">
        {/* Nombre */}
        <h3 className="text-[11px] font-bold uppercase text-center line-clamp-2 min-h-[32px] mb-2 group-hover:text-primary transition-colors leading-tight">
          <Link to={`/productos/${slug}`}>
            {product.name}
          </Link>
        </h3>

        {/* Precio principal */}
        <div className="text-primary font-bold text-[17px] text-center mb-0.5">
          {formatPrice(product.price)}
        </div>

        {/* Precio desde 10 artículos */}
        {lowestTierPrice && lowestTierPrice !== product.price && (
          <div className="text-[10px] text-text-light text-center mb-1">
            desde {formatPrice(lowestTierPrice)} (x10)
          </div>
        )}

        {/* SKU */}
        <div className="text-[11px] text-text-light text-center mb-1">
          SKU {product.sku}
        </div>

        {/* Talla máxima */}
        {maxSize && (
          <div className="text-[11px] text-text-light text-center mb-2">
            Talla: hasta {maxSize}
          </div>
        )}

        {/* Colores por producto */}
        <div className="flex gap-1 justify-center mt-1 flex-wrap">
          {colors.slice(0, 7).map((color, i) => (
            <span
              key={i}
              className="w-4 h-4 rounded-full border border-gray-300 inline-block shrink-0"
              title={color.name}
              style={{ backgroundColor: color.hex || '#cccccc' }}
            />
          ))}
        </div>
      </div>

      {/* Botón Agregar — aparece al hover, pegado al fondo */}
      <Link
        to={`/productos/${slug}`}
        className="absolute bottom-0 left-0 w-full py-2 bg-primary text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 transition-all duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
        </svg>
        VER PRODUCTO
      </Link>
    </div>
  )
}
