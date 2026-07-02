import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const WHATSAPP_NUMBER = '56957025456'

export default function OrderSuccess() {
  const [order, setOrder] = useState(null)

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('maisi_order')
      if (stored) {
        setOrder(JSON.parse(stored))
        sessionStorage.removeItem('maisi_order')
      }
    } catch {
      // ignore
    }
  }, [])

  const openWhatsApp = () => {
    const msg = encodeURIComponent('¡Hola! Acabo de enviar una orden de compra por WhatsApp. ¿Pueden confirmar que la recibieron?')
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">

        {/* Check anim */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          </div>
        </div>

        {/* Texto principal */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide mb-3">
            ¡Pedido enviado!
          </h1>
          {order?.nombre && (
            <p className="text-lg text-text-light mb-1">Gracias, <strong className="text-text">{order.nombre}</strong>.</p>
          )}
          <p className="text-text-light leading-relaxed">
            Tu solicitud fue enviada por WhatsApp al equipo Maisi.
            En breve te contactarán para confirmar los detalles del bordado y coordinar el pago.
          </p>
        </div>

        {/* Pasos siguientes */}
        <div className="bg-white border border-border rounded-sm shadow-sm p-6 mb-6">
          <h2 className="font-bold text-sm uppercase tracking-wide mb-4">Próximos pasos</h2>
          <ol className="space-y-4">
            {[
              {
                n: '1',
                color: 'bg-[#25D366]',
                title: 'Confirmar orden por WhatsApp',
                desc: 'El equipo Maisi revisará tu solicitud y te responderá para confirmar disponibilidad y detalles.'
              },
              {
                n: '2',
                color: 'bg-primary',
                title: 'Definir diseño de bordado',
                desc: 'Coordinarán directamente el logo, texto, posición y colores de hilo según tu requerimiento.'
              },
              {
                n: '3',
                color: 'bg-amber-500',
                title: 'Realizar transferencia bancaria',
                desc: 'Una vez confirmado el diseño, te enviarán los datos bancarios para procesar el pago.'
              },
              {
                n: '4',
                color: 'bg-green-600',
                title: 'Despacho a todo Chile',
                desc: 'Preparamos y despachamos tu pedido con bordado terminado a la dirección indicada.'
              },
            ].map((step) => (
              <li key={step.n} className="flex gap-3">
                <span className={`${step.color} text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  {step.n}
                </span>
                <div>
                  <p className="font-semibold text-sm">{step.title}</p>
                  <p className="text-xs text-text-light mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <button
            onClick={openWhatsApp}
            className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold uppercase text-sm tracking-wider py-3.5 rounded-sm transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
            </svg>
            Abrir WhatsApp
          </button>

          <Link
            to="/productos"
            className="w-full flex items-center justify-center gap-2 border border-border bg-white hover:bg-gray-50 text-text font-bold uppercase text-sm tracking-wider py-3.5 rounded-sm transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            Seguir comprando
          </Link>
        </div>

        {/* Contacto directo */}
        <p className="text-center text-xs text-text-light mt-6">
          ¿Necesitas ayuda inmediata?
          <a href="tel:+56957025456" className="text-primary font-semibold hover:underline ml-1">+56 9 5702 5456</a>
          {' '}·{' '}
          <a href="mailto:contacto@maisi.cl" className="text-primary font-semibold hover:underline">contacto@maisi.cl</a>
        </p>

      </div>
    </div>
  )
}
