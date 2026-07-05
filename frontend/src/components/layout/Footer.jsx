import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-border font-sans">

      {/* ── Mapa ── */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center font-bold text-primary text-sm uppercase tracking-wider mb-6">
            VISÍTANOS EN SOR TERESA DE LOS ANDES 519, GRANEROS, CHILE.
          </p>

          {/* Mapa embed */}
          <div className="w-full overflow-hidden border border-border" style={{ height: 320 }}>
            <iframe
              title="Ubicación Maisi"
              src="https://maps.google.com/maps?q=Sor%20teresa%20de%20los%20andes%20519,%20Graneros,%20Chile&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="320"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* ── Footer Links ── */}
      <div className="bg-[#f8f8f8] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Logo + RRSS */}
            <div>
              <Link to="/">
                <img
                  src="/icons/logo_maisi.jpeg"
                  alt="Maisi Logo"
                  className="h-16 object-contain mb-5 rounded"
                />
              </Link>
              <div className="flex gap-3">
                <a href="https://www.instagram.com/maisi_bordados" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center hover:bg-accent transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
              </div>
            </div>

            {/* Nosotros */}
            <div>
              <h4 className="font-bold text-sm mb-5 uppercase border-b-2 border-primary inline-block pb-1">NOSOTROS</h4>
              <ul className="space-y-2 text-sm text-text-light">
                <li><Link to="/nosotros"     className="hover:text-primary transition-colors">Nosotros</Link></li>
                <li><Link to="/contacto"     className="hover:text-primary transition-colors">Contacto</Link></li>
              </ul>
            </div>

            {/* Categorías */}
            <div>
              <h4 className="font-bold text-sm mb-5 uppercase border-b-2 border-primary inline-block pb-1">CATEGORÍAS</h4>
              <ul className="space-y-2 text-sm text-text-light">
                <li><Link to="/10-hombre"  className="hover:text-primary transition-colors">Hombre</Link></li>
                <li><Link to="/11-mujer" className="hover:text-primary transition-colors">Mujer</Link></li>
                <li><Link to="/12-calzado" className="hover:text-primary transition-colors">Calzado</Link></li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="font-bold text-sm mb-5 uppercase border-b-2 border-primary inline-block pb-1">LA TIENDA</h4>
              <ul className="space-y-3 text-sm text-text-light">
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary mt-0.5 shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>Sor Teresa de los Andes 519, Graneros, Chile.</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary mt-0.5 shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <span>+56957025456</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary mt-0.5 shrink-0"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  <span>contacto@maisi.cl</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── Copyright ── */}
      <div className="bg-[#2a2a2a] py-4 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4">
          <p>&copy; {currentYear} Maisi — Vestuario Corporativo y Bordados. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
