import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'

const NAV_ITEMS = [
  {
    label: 'HOMBRE',
    to: '/10-hombre',
    subcats: [
      { label: 'Poleras',              tipo: 'polera' },
      { label: 'Camisas',              tipo: 'camisa' },
      { label: 'Chaquetas / Casacas',  tipo: 'chaqueta,casaca' },
      { label: 'Parkas / Cortavientos',tipo: 'parka,cortaviento' },
      { label: 'Pantalones',           tipo: 'pantalon,pantalón' },
      { label: 'Chalecos',             tipo: 'chaleco' },
      { label: 'Polares',              tipo: 'micropolar,primera' },
      { label: 'Overoles / Jardineras',tipo: 'overol,jardinera' },
      { label: 'Jeans',                tipo: 'jeans' },
    ],
  },
  {
    label: 'MUJER',
    to: '/11-mujer',
    subcats: [
      { label: 'Poleras',              tipo: 'polera' },
      { label: 'Blusas',               tipo: 'blusa' },
      { label: 'Chaquetas',            tipo: 'chaqueta' },
      { label: 'Parkas / Cortavientos',tipo: 'parka,cortaviento' },
      { label: 'Pantalones',           tipo: 'pantalon,pantalón' },
      { label: 'Chalecos',             tipo: 'chaleco' },
      { label: 'Polares',              tipo: 'micropolar,primera' },
      { label: 'Jeans',                tipo: 'jeans' },
    ],
  },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openMobile, setOpenMobile] = useState(null)
  const [showNotice, setShowNotice] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { itemCount, cartNotice, cartNoticeTs, clearCartNotice } = useCart()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSearchTerm(params.get('q') || '')
  }, [location.search])

  useEffect(() => {
    if (!cartNoticeTs || !cartNotice) return
    setShowNotice(true)
    const timer = setTimeout(() => {
      setShowNotice(false)
      clearCartNotice()
    }, 2200)
    return () => clearTimeout(timer)
  }, [cartNoticeTs, cartNotice, clearCartNotice])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const q = searchTerm.trim()
    navigate(q ? `/productos?q=${encodeURIComponent(q)}` : '/productos')
    setIsMenuOpen(false)
    setOpenMobile(null)
  }

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md w-full">
      {showNotice && cartNotice && (
        <div className="fixed top-4 right-4 z-[80] rounded-md border border-green-300 bg-green-50 px-4 py-2 text-sm font-semibold text-green-800 shadow-lg">
          {cartNotice}
        </div>
      )}

      {/* TopBar */}
      <div className="bg-[#1a1a1a] text-[12px] hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-9">
            <div className="flex items-center text-white font-medium tracking-wide">
              Maisi - Líderes en vestuario corporativo y bordado corporativo
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

              {NAV_ITEMS.map(item => (
                <div key={item.to} className="relative group">
                  <Link
                    to={item.to}
                    className="hover:text-accent transition flex items-center gap-1 py-7"
                  >
                    {item.label}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
                  </Link>

                  {/* Dropdown */}
                  <div className="absolute top-full left-0 hidden group-hover:block z-50 pt-0">
                    <div className="bg-white shadow-xl border border-gray-100 rounded-b-lg py-1 min-w-[200px]">
                      <Link
                        to={item.to}
                        className="flex items-center gap-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-primary hover:bg-gray-50 border-b border-gray-100"
                      >
                        Ver todo
                      </Link>
                      {item.subcats.map(sub => (
                        <Link
                          key={sub.tipo}
                          to={`${item.to}?tipo=${encodeURIComponent(sub.tipo)}`}
                          className="block px-4 py-2 text-[13px] font-semibold normal-case tracking-normal text-text hover:bg-gray-50 hover:text-accent transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </nav>

            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xl mx-5">
              <div className="w-full flex rounded-full border border-gray-300 overflow-hidden bg-white">
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="¿Qué buscas?"
                  className="w-full px-4 py-2.5 text-sm text-text placeholder:text-gray-400 focus:outline-none"
                  aria-label="Buscar productos por nombre o SKU"
                />
                <button
                  type="submit"
                  className="px-4 bg-[#213C6B] text-white hover:bg-[#1a3058] transition-colors"
                  aria-label="Buscar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.3-4.3"/>
                  </svg>
                </button>
              </div>
            </form>

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

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border font-bold uppercase text-sm">
            <form onSubmit={handleSearchSubmit} className="px-4 py-3 border-b border-border bg-white">
              <div className="w-full flex rounded-full border border-gray-300 overflow-hidden bg-white">
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="¿Qué buscas?"
                  className="w-full px-4 py-2 text-sm normal-case tracking-normal text-text placeholder:text-gray-400 focus:outline-none"
                  aria-label="Buscar productos por nombre o SKU"
                />
                <button
                  type="submit"
                  className="px-4 bg-[#213C6B] text-white"
                  aria-label="Buscar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.3-4.3"/>
                  </svg>
                </button>
              </div>
            </form>
            {NAV_ITEMS.map(item => (
              <div key={item.to} className="border-b border-border">
                <div className="flex items-center justify-between px-4">
                  <Link
                    to={item.to}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-3 hover:text-accent flex-1"
                  >
                    {item.label}
                  </Link>
                  <button
                    onClick={() => setOpenMobile(openMobile === item.to ? null : item.to)}
                    className="p-2 hover:text-accent"
                  >
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                      className={`transition-transform ${openMobile === item.to ? 'rotate-180' : ''}`}
                    >
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </button>
                </div>
                {openMobile === item.to && (
                  <div className="bg-gray-50 px-4 pb-2">
                    {item.subcats.map(sub => (
                      <Link
                        key={sub.tipo}
                        to={`${item.to}?tipo=${encodeURIComponent(sub.tipo)}`}
                        onClick={() => { setIsMenuOpen(false); setOpenMobile(null) }}
                        className="block py-2 pl-3 text-xs font-semibold normal-case tracking-normal text-text-light border-l-2 border-gray-200 hover:border-accent hover:text-accent transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
