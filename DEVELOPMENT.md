# 🔧 Guía de Desarrollo - Tworld Distribuidor

## Convenciones de Código

### Frontend (React/JavaScript)
```javascript
// ✅ Correcto
- Componentes: PascalCase → ProductCard.jsx
- Hooks: usePrefix → useProducts.js
- Stores: camelCaseStore → cartStore.js
- Servicios: camelCase → products.js
- Archivos estáticos: kebab-case → hero-image.png

// Librerías
- @tanstack/react-query → datos del servidor
- zustand → estado cliente (carrito, filtros, auth)
- axios → requests HTTP con interceptores
```

### Backend (Django/Python)
```python
# ✅ Correcto
- Apps: lowercase → apps/products/
- Modelos: PascalCase → class Product(models.Model)
- Serializers: ModelNameSerializer → ProductSerializer
- Vistas: ModelNameViewSet → ProductViewSet
- URLs: kebab-case → /api/products/

# Estructura
config/settings/
  ├── base.py        → común
  ├── development.py → DEBUG=True
  └── production.py  → DEBUG=False
```

## Variables de Entorno

**NUNCA hacer commit de `.env`** — usar `.env.example` como referencia

```bash
# Backend
DJANGO_SETTINGS_MODULE=config.settings.development
SECRET_KEY=...
DEBUG=True
DATABASE_URL=postgresql://...
FLOW_API_KEY=...
FLOW_SECRET_KEY=...

# Frontend
VITE_API_URL=http://localhost:8000
VITE_SITE_NAME=Distribuidora Manuel Mercado
```

## Flujo de Desarrollo

1. **Backend**
   ```
   Modelos → Migraciones → Serializers → ViewSets → URLs
   ```

2. **Frontend**
   ```
   Servicios API → Hooks → Componentes → Páginas
   ```

3. **Pruebas**
   - Probar en local antes de push
   - Verificar env variables
   - Testear flujos completos

## Stack Instalado

**Backend:**
- Django 5.1.4
- DRF 3.15.2
- JWT Simple (5.3.1)
- CORS Headers
- PostgreSQL client

**Frontend:**
- React 19
- Vite 6
- Tailwind CSS 3.4
- Zustand 5
- React Router 6
- React Query 5
- Axios

## Despliegue

**Frontend → Vercel**
- Conectar repo GitHub
- Configurar env: `VITE_API_URL`
- Build: `npm run build`

**Backend → Render**
- Usar `render.yaml` incluido
- Configurar PostgreSQL
- Env variables en Render dashboard

## Contacto & Dudas

- **Especificación completa:** Ver `prompt_maestro_tworld.md`
- **Estructura detallada:** Ver `README.md`
- **Developer:** Brayan Núñez (Analista Programador)
