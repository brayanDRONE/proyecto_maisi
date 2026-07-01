import React from 'react'

export default function Checkout() {
  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Nombre</label>
              <input type="text" className="w-full border rounded-md px-3 py-2" />
            </div>
          </form>
        </div>
        <div>
          <div className="card">
            <h3 className="font-semibold mb-4">Resumen del Pedido</h3>
            <button className="btn-primary w-full">Proceder al Pago</button>
          </div>
        </div>
      </div>
    </div>
  )
}
