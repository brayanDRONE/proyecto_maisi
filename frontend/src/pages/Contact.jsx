import React from 'react'

export default function Contact() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold mb-8">Contacto</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Nombre</label>
            <input type="text" className="w-full border rounded-md px-3 py-2" />
          </div>
        </form>
        <div>
          <h3 className="font-semibold mb-4">Nuestros Datos</h3>
          <ul className="space-y-2">
            <li>📧 info@distribuidora.cl</li>
            <li>📱 +56 9 1234 5678</li>
            <li>📍 Santiago, Chile</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
