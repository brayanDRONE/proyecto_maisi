import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { itemCount } = useCart()
  const { isAuthenticated, user } = useAuth()

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md w-full">
      {/* TopBar */}
      <div className="bg-[#1a1a1a] text-[12px] hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-9">
            <div className="flex items-center text-white font-medium tracking-wide">
              Maisi - Líderes en vestuario corporativo, seguridad y EPP
            </div>
            <div className="flex items-center gap-5 text-white font-bold uppercase tracking-wide">
              <Link to="/nosotros" className="hover:text-gray-300 transition">NOSOTROS</Link>
              <Link to="/contacto" className="hover:text-gray-300 transition">CONTACTO</Link>
              <Link to="/cotizacion" className="hover:text-gray-300 transition">COTIZACIÓN</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img 
                src="/icons/logo_maisi.jpeg" 
                alt="Maisi Logo" 
                className="h-16 object-contain rounded"
              />
            </Link>

            {/* Menu desktop */}
            <nav className="hidden lg:flex items-center gap-8 font-display uppercase text-sm tracking-wider font-bold">
              <Link to="/" className="hover:text-accent transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </Link>
              <Link to="/10-hombre" className="hover:text-accent transition">HOMBRE</Link>
              <Link to="/11-mujer" className="hover:text-accent transition">MUJER</Link>
              <Link to="/9-lineas" className="hover:text-accent transition">VESTUARIO / LÍNEAS</Link>
              <Link to="/12-calzado" className="hover:text-accent transition">CALZADO</Link>
              <Link to="/epp" className="hover:text-accent transition">EPP</Link>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-5 text-text">
              <Link to="/carrito" className="relative hover:text-primary transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              </Link>

              <button
                className="lg:hidden hover:text-primary"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden border-t border-border px-4 py-2 font-bold uppercase text-sm">
            <Link to="/10-hombre" onClick={() => setIsMenuOpen(false)} className="block py-3 border-b border-border hover:text-accent">Hombre</Link>
            <Link to="/11-mujer" onClick={() => setIsMenuOpen(false)} className="block py-3 border-b border-border hover:text-accent">Mujer</Link>
            <Link to="/9-lineas" onClick={() => setIsMenuOpen(false)} className="block py-3 border-b border-border hover:text-accent">Vestuario / Líneas</Link>
            <Link to="/12-calzado" onClick={() => setIsMenuOpen(false)} className="block py-3 border-b border-border hover:text-accent">Calzado</Link>
            <Link to="/epp" onClick={() => setIsMenuOpen(false)} className="block py-3 hover:text-accent">EPP</Link>
          </div>
        )}
      </div>
    </header>
  )
}
