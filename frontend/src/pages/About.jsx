import React from 'react'

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.14),_transparent_30%)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <span className="inline-flex rounded-full border border-orange-300/35 bg-orange-300/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-100">
            MAISI Bordados
          </span>
          <h1 className="mt-4 max-w-4xl font-display text-3xl font-black uppercase leading-tight text-white sm:text-4xl lg:text-5xl">
            Nuestra historia
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base">
            Potenciamos la imagen de empresas y equipos con vestuario corporativo de alto estándar, bordado profesional y una atención cercana en cada etapa del proyecto.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm leading-7 text-slate-700 sm:text-base">
              En MAISI Bordados contamos con una sólida experiencia en la industria, dedicándonos a ayudar a empresas, emprendedores y organizaciones a proyectar una imagen profesional a través de ropa corporativa de alta calidad.
            </p>
            <p className="mt-5 text-sm leading-7 text-slate-700 sm:text-base">
              Como distribuidores oficiales de T-World, trabajamos con prendas cuidadosamente seleccionadas por su calidad, durabilidad y comodidad. Además, ofrecemos un servicio de bordado profesional que transforma cada prenda en una representación de la identidad de su empresa.
            </p>
            <p className="mt-5 text-sm leading-7 text-slate-700 sm:text-base">
              Entendemos que la ropa corporativa es mucho más que un uniforme; es una herramienta que fortalece la imagen de marca, genera confianza y transmite profesionalismo. Por ello, brindamos una atención personalizada, asesorando a cada cliente desde la selección de las prendas hasta la confección final de su proyecto.
            </p>
            <p className="mt-5 text-sm leading-7 text-slate-700 sm:text-base">
              Nuestro compromiso es entregar soluciones que reflejen la esencia de cada empresa, cuidando cada detalle para que su equipo proyecte una imagen coherente, profesional y de alto nivel.
            </p>
            <p className="mt-5 text-sm leading-7 text-slate-900 font-semibold sm:text-base">
              En MAISI Bordados no solo confeccionamos ropa corporativa; damos vida a su marca, fortalecemos su identidad y la ayudamos a destacar.
            </p>
          </article>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Experiencia aplicada</p>
              <p className="mt-2 text-2xl font-black text-primary">Imagen corporativa real</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">Combinamos producto, bordado y asesoría para que tu equipo comunique profesionalismo desde el primer contacto.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Servicio integral</p>
              <p className="mt-2 text-2xl font-black text-primary">Acompañamiento completo</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">Te guiamos desde la elección de prendas hasta la entrega final, cuidando tiempos, calidad y consistencia visual.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
