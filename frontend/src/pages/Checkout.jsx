import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { submitOrder } from '../services/orders'

const WHATSAPP_NUMBER = '56957025456'

const REGIONES = [
  'Región de Arica y Parinacota',
  'Región de Tarapacá',
  'Región de Antofagasta',
  'Región de Atacama',
  'Región de Coquimbo',
  'Región de Valparaíso',
  'Región Metropolitana de Santiago',
  'Región del Libertador Gral. Bernardo O’Higgins',
  'Región del Maule',
  'Región de Ñuble',
  'Región del Biobío',
  'Región de La Araucanía',
  'Región de Los Ríos',
  'Región de Los Lagos',
  'Región de Aysén',
  'Región de Magallanes y la Antártica Chilena',
]

const formatCLP = (n) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(n)

const INITIAL = {
  nombre: '',
  rut: '',
  telefono: '',
  email: '',
  empresa: '',
  direccion: '',
  ciudad: '',
  region: '',
  notas: '',
}

const Field = ({ id, label, required, error, children }) => (
  <div id={`field-${id}`}>
    <label className="block text-sm font-semibold mb-1.5">
      {label} {required && <span className="text-accent">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-accent mt-1">{error}</p>}
  </div>
)

export default function Checkout() {
  const navigate = useNavigate()
  const { items, total, clearCart } = useCart()
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
        <h2 className="text-2xl font-bold">Tu carrito está vacío</h2>
        <Link to="/productos" className="btn-primary px-6 py-3">Ver catálogo</Link>
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.nombre.trim()) e.nombre = 'Requerido'
    if (!form.rut.trim()) e.rut = 'Requerido'
    if (!form.telefono.trim()) e.telefono = 'Requerido'
    if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = 'Email inválido'
    if (!form.direccion.trim()) e.direccion = 'Requerido'
    if (!form.ciudad.trim()) e.ciudad = 'Requerido'
    if (!form.region) e.region = 'Selecciona una región'
    return e
  }

  const buildWhatsAppMessage = (orderNumber) => {
    const lines = items.map(item => {
      const variant = item.variant
      const size = variant?.size ? ` - Talla ${variant.size}` : ''
      const color = variant?.color ? ` - ${variant.color}` : ''
      return `  • ${item.quantity}x ${item.product.name}${size}${color} → ${formatCLP(item.product.price * item.quantity)}`
    })

    const msg = [
      '🛒 *NUEVA ORDEN DE COMPRA - MAISI*',
      '📋 *N° de Orden:* ' + orderNumber,
      '',
      '👤 *Cliente:* ' + form.nombre,
      '🆔 *RUT:* ' + form.rut,
      '📱 *Teléfono:* ' + form.telefono,
      '📧 *Email:* ' + form.email,
      form.empresa ? '🏢 *Empresa:* ' + form.empresa : null,
      '',
      '📦 *PRODUCTOS SOLICITADOS:*',
      ...lines,
      '',
      `💰 *Subtotal:* ${formatCLP(total)}`,
      '🚚 *Envío:* A coordinar',
      '━━━━━━━━━━━━━━━',
      `💳 *TOTAL:* ${formatCLP(total)}`,
      '',
      '🚚 *DIRECCIÓN DE DESPACHO:*',
      '  ' + form.direccion,
      '  ' + form.ciudad + ', ' + form.region,
      '',
      '💳 *Método de pago:* Transferencia Bancaria',
      form.notas ? ('✂️ *Notas de bordado:*\n  ' + form.notas) : null,
      '',
      '📧 *PDF del pedido enviado al correo del cliente.*',
      '',
      '_Responde este mensaje para confirmar la orden, coordinar el diseño de bordado y recibir los datos de transferencia._',
    ].filter(l => l !== null).join('\n')

    return msg
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      const firstErrKey = Object.keys(errs)[0]
      document.getElementById(`field-${firstErrKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setSubmitting(true)

    try {
      const { order_number, pdf_base64 } = await submitOrder({ form, items, total })

      // Auto-download PDF
      const pdfBytes = Uint8Array.from(atob(pdf_base64), (c) => c.charCodeAt(0))
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const blobUrl = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = blobUrl
      anchor.download = `pedido_${order_number}.pdf`
      document.body.appendChild(anchor)
      anchor.click()
      setTimeout(() => {
        document.body.removeChild(anchor)
        URL.revokeObjectURL(blobUrl)
      }, 200)

      // Open WhatsApp
      const msg = buildWhatsAppMessage(order_number)
      const encoded = encodeURIComponent(msg)
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank', 'noopener,noreferrer')

      sessionStorage.setItem('maisi_order', JSON.stringify({
        nombre: form.nombre,
        total,
        items: items.length,
        order_number,
      }))

      clearCart()
      navigate('/pedido-confirmado')
    } catch (err) {
      console.error('Error al enviar pedido:', err)
      setSubmitting(false)
      alert('Hubo un error al procesar tu pedido. Por favor intenta nuevamente.')
    }
  }

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0)

  const inputClass = (name) =>
    `w-full border rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${
      errors[name] ? 'border-accent' : 'border-border'
    }`

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <nav className="text-xs text-text-light flex items-center gap-1.5">
            <Link to="/" className="hover:text-primary">Inicio</Link>
            <span>›</span>
            <Link to="/carrito" className="hover:text-primary">Carrito</Link>
            <span>›</span>
            <span className="text-text font-semibold">Confirmar pedido</span>
          </nav>
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide mt-2">
            Datos del pedido
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">

            {/* ── FORMULARIO ── */}
            <div className="space-y-6">

              {/* Datos de contacto */}
              <section className="bg-white border border-border rounded-sm shadow-sm p-6">
                <h2 className="font-bold text-base uppercase tracking-wide mb-5 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Datos de contacto
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field id="nombre" label="Nombre completo" required error={errors.nombre}>
                    <input name="nombre" value={form.nombre} onChange={handleChange}
                      className={inputClass('nombre')} placeholder="Juan Pérez" />
                  </Field>
                  <Field id="rut" label="RUT" required error={errors.rut}>
                    <input name="rut" value={form.rut} onChange={handleChange}
                      className={inputClass('rut')} placeholder="12.345.678-9" />
                  </Field>
                  <Field id="telefono" label="Teléfono" required error={errors.telefono}>
                    <input name="telefono" value={form.telefono} onChange={handleChange}
                      type="tel" className={inputClass('telefono')} placeholder="+56 9 1234 5678" />
                  </Field>
                  <Field id="email" label="Correo electrónico" required error={errors.email}>
                    <input name="email" value={form.email} onChange={handleChange}
                      type="email" className={inputClass('email')} placeholder="correo@empresa.cl" />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field id="empresa" label="Empresa / Razón social" error={errors.empresa}>
                      <input name="empresa" value={form.empresa} onChange={handleChange}
                        className={inputClass('empresa')} placeholder="Opcional" />
                    </Field>
                  </div>
                </div>
              </section>

              {/* Dirección de envío */}
              <section className="bg-white border border-border rounded-sm shadow-sm p-6">
                <h2 className="font-bold text-base uppercase tracking-wide mb-5 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  Dirección de despacho
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Field id="direccion" label="Dirección" required error={errors.direccion}>
                      <input name="direccion" value={form.direccion} onChange={handleChange}
                        className={inputClass('direccion')} placeholder="Av. Providencia 1234, Dpto 5B" />
                    </Field>
                  </div>
                  <Field id="ciudad" label="Ciudad" required error={errors.ciudad}>
                    <input name="ciudad" value={form.ciudad} onChange={handleChange}
                      className={inputClass('ciudad')} placeholder="Santiago" />
                  </Field>
                  <Field id="region" label="Región" required error={errors.region}>
                    <select name="region" value={form.region} onChange={handleChange}
                      className={inputClass('region')}>
                      <option value="">Seleccionar región…</option>
                      {REGIONES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </Field>
                </div>
              </section>

              {/* Notas de bordado */}
              <section className="bg-white border border-border rounded-sm shadow-sm p-6">
                <h2 className="font-bold text-base uppercase tracking-wide mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 14 4-4"/><path d="m14 18-4 4"/><path d="m2 22 2-2"/><path d="M22 2 12 12"/><path d="M11 22 2 13"/><path d="M2 2l20 20"/></svg>
                  Notas de bordado y diseño
                  <span className="text-xs font-normal text-text-light normal-case ml-1">(opcional)</span>
                </h2>
                <p className="text-xs text-text-light mb-3 leading-relaxed">
                  Descríbe brevemente lo que necesitas: logo, texto, posición, colores de hilo, etc. El equipo Maisi te contactará por WhatsApp para afinar los detalles y enviarte una vista previa.
                </p>
                <textarea
                  name="notas"
                  value={form.notas}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-border rounded-sm px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                  placeholder="Ej: Logo empresa en pecho izquierdo, texto &quot;MAISI&quot; en espalda con hilo blanco sobre fondo azul marino…"
                />
              </section>

              {/* Transferencia bancaria */}
              <section className="bg-blue-50 border border-primary/20 rounded-sm p-6">
                <h2 className="font-bold text-base uppercase tracking-wide mb-4 text-primary flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>
                  Pago por transferencia bancaria
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold uppercase text-text-light tracking-wide">Banco</span>
                    <span className="font-semibold">Banco de Chile</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold uppercase text-text-light tracking-wide">Tipo de cuenta</span>
                    <span className="font-semibold">Cuenta Corriente</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold uppercase text-text-light tracking-wide">Número de cuenta</span>
                    <span className="font-semibold">XXXXXXXX</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold uppercase text-text-light tracking-wide">RUT titular</span>
                    <span className="font-semibold">XX.XXX.XXX-X</span>
                  </div>
                  <div className="flex flex-col gap-0.5 sm:col-span-2">
                    <span className="text-xs font-semibold uppercase text-text-light tracking-wide">Nombre titular</span>
                    <span className="font-semibold">Maisi SpA</span>
                  </div>
                  <div className="flex flex-col gap-0.5 sm:col-span-2">
                    <span className="text-xs font-semibold uppercase text-text-light tracking-wide">Email para comprobante</span>
                    <span className="font-semibold">contacto@maisi.cl</span>
                  </div>
                </div>
                <p className="mt-4 text-xs text-primary/80 leading-relaxed">
                  💡 Los datos bancarios exactos serán confirmados por el equipo Maisi a través de WhatsApp una vez recibida tu solicitud.
                </p>
              </section>

            </div>

            {/* ── PANEL LATERAL: Resumen ── */}
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="bg-white border border-border rounded-sm shadow-sm p-6">
                <h2 className="font-display text-base font-bold uppercase tracking-wide border-b border-border pb-4 mb-4">
                  Tu pedido ({totalItems} {totalItems === 1 ? 'artículo' : 'artículos'})
                </h2>
                <div className="space-y-3">
                  {items.map((item, idx) => {
                    const img = item.product.image || item.product.primary_image || '/icons/logo_maisi.jpeg'
                    return (
                      <div key={idx} className="flex gap-3 text-sm">
                        <img
                          src={img}
                          alt={item.product.name}
                          className="w-12 h-12 object-contain border border-gray-100 rounded flex-shrink-0 bg-white"
                          onError={(e) => { e.currentTarget.src = '/icons/logo_maisi.jpeg' }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold line-clamp-2 leading-tight text-xs uppercase">{item.product.name}</p>
                          {item.variant?.size && (
                            <p className="text-xs text-text-light mt-0.5">
                              {item.variant.size}{item.variant.color ? ` · ${item.variant.color}` : ''}
                            </p>
                          )}
                          <p className="text-xs font-bold mt-1">{item.quantity}× {formatCLP(item.product.price)}</p>
                        </div>
                        <span className="font-bold text-sm flex-shrink-0">{formatCLP(item.product.price * item.quantity)}</span>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t border-border mt-4 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-light">Subtotal</span>
                    <span className="font-semibold">{formatCLP(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-light">Envío</span>
                    <span className="text-text-light italic">A coordinar</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t border-border pt-3 mt-1">
                    <span>Total estimado</span>
                    <span className="text-primary">{formatCLP(total)}</span>
                  </div>
                </div>
              </div>

              {/* Botón principal */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5d] disabled:opacity-60 text-white font-bold uppercase text-sm tracking-wider py-4 rounded-sm transition-colors shadow-sm"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    Generando PDF y enviando…
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                    </svg>
                    Enviar orden por WhatsApp
                  </>
                )}
              </button>
              <p className="text-center text-xs text-text-light">
                Al confirmar se generará tu PDF, llegará un correo de respaldo y se abrirá WhatsApp con tu orden.
              </p>
            </div>

          </div>
        </div>
      </form>
    </div>
  )
}
