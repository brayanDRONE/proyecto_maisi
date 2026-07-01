import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from '../pages/Home'
import Catalog from '../pages/Catalog'
import ProductDetail from '../pages/ProductDetail'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import OrderSuccess from '../pages/OrderSuccess'
import QuoteForm from '../pages/QuoteForm'
import About from '../pages/About'
import Contact from '../pages/Contact'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* All products */}
      <Route path="/productos" element={<Catalog />} />

      {/* Product detail */}
      <Route path="/productos/:slug" element={<ProductDetail />} />

      {/* Other pages */}
      <Route path="/carrito"           element={<Cart />} />
      <Route path="/checkout"          element={<Checkout />} />
      <Route path="/pedido-confirmado" element={<OrderSuccess />} />
      <Route path="/cotizacion"        element={<QuoteForm />} />
      <Route path="/nosotros"          element={<About />} />
      <Route path="/contacto"          element={<Contact />} />

      {/* Category catalog routes — must be after specific routes */}
      <Route path="/:categoryId" element={<Catalog />} />

      {/* 404 */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center text-center p-8">
          <div>
            <div className="text-8xl font-black text-gray-200 mb-6">404</div>
            <h1 className="text-3xl font-bold mb-4">Página no encontrada</h1>
            <a href="/" className="text-primary underline">Volver al inicio</a>
          </div>
        </div>
      } />
    </Routes>
  )
}
