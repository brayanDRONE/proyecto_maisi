# 🏗️ Tworld Distribuidor - Proyecto E-Commerce

Portal web para distribuidor oficial Tworld Chile. Estructura lista para desarrollo.

**Estado:** ✅ Estructura base completada  
**Cliente:** Manuel Mercado  
**Developer:** Brayan Núñez

---

## 📁 Estructura

```
proyecto_maisi/
├── backend/              ← Django 5 + DRF + PostgreSQL
│   ├── config/          ← Configuración Django
│   ├── apps/            ← 5 aplicaciones (products, orders, payments, users, quotes)
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/             ← React 19 + Vite + Tailwind
│   ├── src/
│   │   ├── components/  ← UI, layout, catalog, product, cart, checkout
│   │   ├── pages/       ← 9 páginas principales
│   │   ├── services/    ← APIs (axios + interceptores)
│   │   ├── store/       ← Zustand (carrito, auth, filtros)
│   │   ├── hooks/       ← Custom hooks
│   │   ├── utils/       ← Utilidades
│   │   └── router/      ← React Router v6
│   └── package.json
│
└── prompt_maestro_tworld.md   ← Especificación completa del proyecto
```

---

## 🚀 Inicio Rápido

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver
```
Disponible en: `http://localhost:8000`

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Disponible en: `http://localhost:5173`

---

## 🎯 Próximos Pasos

- [ ] **Fase 1** - Serializers DRF + Endpoints básicos
- [ ] **Fase 2** - Componentes React + Catálogo
- [ ] **Fase 3** - Carrito + Checkout
- [ ] **Fase 4** - Integración Flow.cl
- [ ] **Fase 5** - Autenticación JWT
- [ ] **Fase 6** - Panel Admin
- [ ] **Fase 7** - Despliegue (Vercel + Render)

---

Ver `DEVELOPMENT.md` para guía de convenciones y `prompt_maestro_tworld.md` para especificación completa.
