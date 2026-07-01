import React from 'react'

export default function QuoteForm() {
  return (
    <div className="min-h-screen max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold mb-8">Solicitar Cotización</h1>
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Empresa</label>
          <input type="text" className="w-full border rounded-md px-3 py-2" />
        </div>
      </form>
    </div>
  )
}
