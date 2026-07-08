import React, { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = e => {
    e.preventDefault()
    const text = `Nombre: ${form.name}%0AEmail: ${form.email}%0ATeléfono: ${form.phone}%0AMensaje: ${form.message}`
    window.open(`https://wa.me/56957025456?text=${text}`, '_blank')
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-slate-950 py-14 text-center">
        <h1 className="font-display text-4xl font-bold text-white uppercase tracking-widest">Contacto</h1>
        <p className="mt-3 text-slate-300 text-sm">Estamos para ayudarte — escríbenos y te respondemos a la brevedad.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* Formulario */}
        <div>
          <h2 className="font-display text-xl font-bold text-primary uppercase tracking-wide mb-6">Envíanos un mensaje</h2>
          {sent ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <p className="text-green-700 font-semibold text-lg">¡Mensaje enviado!</p>
              <p className="text-green-600 text-sm mt-1">Te redirigimos a WhatsApp. Te responderemos pronto.</p>
              <button onClick={() => setSent(false)} className="mt-4 text-sm text-primary underline">Enviar otro mensaje</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-text">Nombre *</label>
                <input
                  type="text" name="name" required value={form.name} onChange={handleChange}
                  placeholder="Tu nombre completo"
                  className="w-full border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-text">Email *</label>
                <input
                  type="email" name="email" required value={form.email} onChange={handleChange}
                  placeholder="tu@email.com"
                  className="w-full border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-text">Teléfono</label>
                <input
                  type="tel" name="phone" value={form.phone} onChange={handleChange}
                  placeholder="+56 9 XXXX XXXX"
                  className="w-full border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-text">Mensaje *</label>
                <textarea
                  name="message" required rows={5} value={form.message} onChange={handleChange}
                  placeholder="¿En qué podemos ayudarte?"
                  className="w-full border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white font-bold uppercase tracking-widest text-sm py-3 rounded-md hover:bg-accent transition-colors"
              >
                Enviar por WhatsApp
              </button>
            </form>
          )}
        </div>

        {/* Datos de contacto */}
        <div>
          <h2 className="font-display text-xl font-bold text-primary uppercase tracking-wide mb-6">Nuestros Datos</h2>
          <ul className="space-y-5">
            <li className="flex items-start gap-4">
              <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-text-light mb-0.5">Email</p>
                <a href="mailto:contacto@maisibordados.com" className="text-sm font-semibold text-text hover:text-primary transition-colors">
                  contacto@maisibordados.com
                </a>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.5 16l.42.92z"/></svg>
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-text-light mb-0.5">Teléfono</p>
                <a href="tel:+56957025456" className="text-sm font-semibold text-text hover:text-primary transition-colors">
                  +56 9 5702 5456
                </a>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-text-light mb-0.5">Dirección</p>
                <p className="text-sm font-semibold text-text">Sor Teresa de los Andes 519, Graneros, Chile.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="w-10 h-10 rounded-full bg-[#25D366]/15 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-text-light mb-0.5">WhatsApp</p>
                <a href="https://wa.me/56957025456" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#25D366] hover:opacity-80 transition-opacity">
                  +56 9 5702 5456
                </a>
              </div>
            </li>
          </ul>
        </div>

      </div>
    </div>
  )
}

