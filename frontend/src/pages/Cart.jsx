import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'

const formatCLP = (n) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(n)

const FALLBACK = '/icons/logo_maisi.jpeg'

export default function Cart() {
  const navigate = useNavigate()
  const { items, removeItem, updateQuantity, clearCart, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.6">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
            <path d="M3 6h18"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
          <p className="text-text-light mb-6">Agrega productos para continuar con tu pedido corporativo.</p>
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 bg-primary text-white font-bold uppercase text-sm tracking-wider px-6 py-3 hover:bg-primary-light transition-colors rounded-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            Ver catálogo
          </Link>
        </div>
      </div>
    )
  }

  const handleQtyChange = (item, delta) => {
    const newQty = item.quantity + delta
    if (newQty < 1) {
      removeItem(item.product.id, item.variant?.id, item.embroideryText)
    } else {
      updateQuantity(item.product.id, item.variant?.id, item.embroideryText, newQty)
    }
  }

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0)

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold uppercase tracking-wide">
              Mi Carrito
              <span className="ml-3 text-base font-normal text-text-light">({totalItems} {totalItems === 1 ? 'producto' : 'productos'})</span>
            </h1>
            <button
              onClick={clearCart}
              className="text-xs text-text-light hover:text-accent transition-colors flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
              Vaciar carrito
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

          {/* ── Lista de productos ── */}
          <div className="space-y-4">
            {items.map((item, idx) => {
              const { product, variant, quantity } = item
              const img = product.image || product.primary_image || FALLBACK
              const lineTotal = product.price * quantity

              return (
                <div key={idx} className="bg-white border border-border rounded-sm flex gap-4 p-4 shadow-sm">
                  {/* Imagen */}
                  <Link to={`/productos/${product.slug || product.id}`} className="flex-shrink-0">
                    <img
                      src={img}
                      alt={product.name}
                      className="w-24 h-24 object-contain border border-gray-100 rounded bg-white"
                      onError={(e) => { e.currentTarget.src = FALLBACK }}
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/productos/${product.slug || product.id}`}
                      className="font-bold text-sm uppercase leading-snug hover:text-primary transition-colors line-clamp-2 block"
                    >
                      {product.name}
                    </Link>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {variant?.size && (
                        <span className="inline-flex items-center gap-1 text-xs text-text-light border border-border rounded px-2 py-0.5">
                          <strong>Talla:</strong> {variant.size}
                        </span>
                      )}
                      {variant?.color && (
                        <span className="inline-flex items-center gap-1 text-xs text-text-light border border-border rounded px-2 py-0.5">
                          <strong>Color:</strong> {variant.color}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-xs text-text-light border border-border rounded px-2 py-0.5">
                        <strong>SKU:</strong> {product.sku}
                      </span>
                    </div>

                    {/* Precio unitario */}
                    <div className="mt-2 text-sm font-bold text-primary">
                      {formatCLP(product.price)} c/u
                    </div>
                  </div>

                  {/* Controles cantidad + subtotal */}
                  <div className="flex flex-col items-end justify-between flex-shrink-0 gap-3">
                    {/* Qty */}
                    <div className="flex items-center border border-border rounded">
                      <button
                        onClick={() => handleQtyChange(item, -1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors text-sm font-bold"
                        aria-label="Disminuir cantidad"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm font-bold">{quantity}</span>
                      <button
                        onClick={() => handleQtyChange(item, +1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors text-sm font-bold"
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal línea */}
                    <div className="text-base font-bold text-right">{formatCLP(lineTotal)}</div>

                    {/* Eliminar */}
                    <button
                      onClick={() => removeItem(item.product.id, item.variant?.id, item.embroideryText)}
                      className="text-xs text-text-light hover:text-accent transition-colors flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      Quitar
                    </button>
                  </div>
                </div>
              )
            })}

            {/* Volver a comprar */}
            <div className="pt-2">
              <Link
                to="/productos"
                className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:underline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
                Seguir comprando
              </Link>
            </div>
          </div>

          {/* ── Panel de totales ── */}
          <div className="lg:sticky lg:top-24 bg-white border border-border rounded-sm shadow-sm p-6 space-y-4">
            <h2 className="font-display text-lg font-bold uppercase tracking-wide border-b border-border pb-4">
              Resumen del pedido
            </h2>

            {/* Líneas */}
            <div className="space-y-2 text-sm">
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between gap-2">
                  <span className="text-text-light truncate max-w-[200px]">
                    {item.quantity}× {item.product.name}
                    {item.variant?.size ? ` (${item.variant.size})` : ''}
                  </span>
                  <span className="font-semibold flex-shrink-0">
                    {formatCLP(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-light">Subtotal</span>
                <span className="font-semibold">{formatCLP(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-light">Envío</span>
                <span className="text-text-light italic">A coordinar</span>
              </div>
            </div>

            <div className="border-t border-border pt-4 flex justify-between items-baseline">
              <span className="font-bold uppercase tracking-wide">Total</span>
              <span className="text-2xl font-bold text-primary">{formatCLP(total)}</span>
            </div>

            {/* Nota */}
            <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-800 leading-relaxed">
              ✂️ <strong>Incluye bordado:</strong> Al continuar podrás indicar los detalles de diseño y bordado directamente con el equipo Maisi por WhatsApp.
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-primary text-white font-bold uppercase text-sm tracking-wider py-3.5 hover:bg-primary-light transition-colors rounded-sm flex items-center justify-center gap-2"
            >
              Confirmar y continuar
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><path d="m13 5 7 7-7 7"/></svg>
            </button>

            {/* Pago seguro */}
            <p className="text-center text-xs text-text-light flex items-center justify-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Compra 100% segura
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
