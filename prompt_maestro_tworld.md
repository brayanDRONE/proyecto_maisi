# 🧠 PROMPT MAESTRO — Portal E-Commerce Distribuidor Tworld
**Proyecto:** Portal web personalizado para distribuidor oficial Tworld  
**Cliente:** Manuel Mercado  
**Desarrollador:** Brayan Núñez — Analista Programador  
**Stack:** React 19 + Vite + Tailwind CSS + Zustand · Django 5 + DRF · PostgreSQL · Flow.cl · Vercel + Render

---

## 🎯 CONTEXTO GENERAL DEL PROYECTO

Estás ayudando a desarrollar un **portal e-commerce completo** para Manuel Mercado, distribuidor oficial de **Tworld Chile (tworldstore.cl)**, empresa de vestuario corporativo, workwear y EPP. Manuel borda las prendas con identidad propia antes de venderlas, lo que le da diferenciación de marca.

El portal debe permitir:
- Mostrar el catálogo de productos Tworld con imágenes, fichas técnicas y certificaciones oficiales
- Que los clientes de Manuel puedan comprar online (carrito + pago con Flow.cl)
- Que Manuel gestione todo desde un panel de administración
- Desplegarse en **Vercel (frontend)** y **Render (backend + PostgreSQL)**

El proyecto usa **monorepo con dos carpetas principales:**
```
tworld-distribuidor/
├── frontend/    → React 19 + Vite + Tailwind + Zustand
└── backend/     → Django 5 + DRF + PostgreSQL
```

---

## 🗂️ ESTRUCTURA COMPLETA DEL PROYECTO

### Frontend (`/frontend`)
```
frontend/
├── public/
│   ├── favicon.ico
│   └── icons/              ← íconos PWA
├── src/
│   ├── assets/             ← imágenes estáticas, logo
│   ├── components/
│   │   ├── ui/             ← componentes base: Button, Badge, Modal, Spinner
│   │   ├── layout/         ← Navbar, Footer, Sidebar
│   │   ├── catalog/        ← ProductCard, ProductGrid, FilterPanel, CategoryMenu
│   │   ├── product/        ← ProductGallery, ProductInfo, CertBadge, SizeGuide
│   │   ├── cart/           ← CartDrawer, CartItem, CartSummary
│   │   └── checkout/       ← CheckoutForm, OrderSummary, PaymentRedirect
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Catalog.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── OrderSuccess.jsx
│   │   ├── OrderPending.jsx
│   │   ├── QuoteForm.jsx       ← formulario pedido corporativo sin pago
│   │   ├── About.jsx
│   │   └── Contact.jsx
│   ├── store/
│   │   ├── cartStore.js        ← Zustand: carrito
│   │   ├── authStore.js        ← Zustand: sesión usuario
│   │   └── filterStore.js      ← Zustand: filtros catálogo
│   ├── services/
│   │   ├── api.js              ← instancia axios con baseURL y interceptores
│   │   ├── products.js         ← llamadas API productos
│   │   ├── orders.js           ← llamadas API órdenes
│   │   └── payment.js          ← llamadas API Flow
│   ├── hooks/
│   │   ├── useProducts.js
│   │   ├── useCart.js
│   │   └── useAuth.js
│   ├── router/
│   │   └── index.jsx           ← React Router v6 con rutas protegidas
│   ├── utils/
│   │   ├── formatCLP.js        ← formatear precios en pesos chilenos
│   │   └── validators.js
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── vite.config.js
├── tailwind.config.js
└── package.json
```

### Backend (`/backend`)
```
backend/
├── config/
│   ├── settings/
│   │   ├── base.py         ← configuración común
│   │   ├── development.py  ← DEBUG=True, SQLite opcional
│   │   └── production.py   ← DEBUG=False, PostgreSQL, ALLOWED_HOSTS
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── products/           ← Modelos: Category, Product, ProductImage, Certificate
│   ├── orders/             ← Modelos: Order, OrderItem
│   ├── payments/           ← Integración Flow.cl: crear pago, webhook, confirmar
│   ├── users/              ← CustomUser, autenticación JWT
│   └── quotes/             ← Cotizaciones corporativas sin pago online
├── media/                  ← imágenes subidas (local dev)
├── requirements.txt
├── manage.py
├── Procfile                ← para Render: "web: gunicorn config.wsgi"
├── render.yaml             ← configuración despliegue Render
└── .env.example
```

---

## 🗄️ MODELOS DE BASE DE DATOS

### Productos
```python
# apps/products/models.py

class Category(models.Model):
    name = models.CharField(max_length=100)          # "Vestuario Hombre"
    slug = models.SlugField(unique=True)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
    image = models.ImageField(upload_to='categories/', blank=True)
    order = models.PositiveIntegerField(default=0)

class Line(models.Model):
    # Líneas Tworld: Practical, Iron, Free Action, Advance, Hi-Vis, Classic, Executive, Outwork
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)

class Product(models.Model):
    sku = models.CharField(max_length=50, unique=True)     # código Tworld
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    line = models.ForeignKey(Line, null=True, blank=True, on_delete=models.SET_NULL)
    description = models.TextField()
    technical_sheet = models.TextField(blank=True)         # ficha técnica
    price = models.DecimalField(max_digits=10, decimal_places=0)  # CLP sin decimales
    stock = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    has_embroidery = models.BooleanField(default=True)     # bordado disponible
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/')
    alt_text = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

class ProductVariant(models.Model):
    # tallas y colores
    product = models.ForeignKey(Product, related_name='variants', on_delete=models.CASCADE)
    size = models.CharField(max_length=10)              # XS, S, M, L, XL, XXL, 3XL
    color = models.CharField(max_length=50, blank=True)
    color_hex = models.CharField(max_length=7, blank=True)  # #1A3C5E
    stock = models.PositiveIntegerField(default=0)

class Certificate(models.Model):
    # Certificaciones: DICTUC, normas técnicas, etc.
    product = models.ForeignKey(Product, related_name='certificates', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)             # "DICTUC - Resistencia al fuego"
    issuer = models.CharField(max_length=100)
    file = models.FileField(upload_to='certificates/', blank=True)
    valid_until = models.DateField(null=True, blank=True)
```

### Órdenes
```python
# apps/orders/models.py

class Order(models.Model):
    STATUS = [
        ('pending',   'Pendiente de pago'),
        ('paid',      'Pagado'),
        ('preparing', 'En preparación'),
        ('shipped',   'Despachado'),
        ('delivered', 'Entregado'),
        ('cancelled', 'Cancelado'),
    ]
    order_number = models.CharField(max_length=20, unique=True)  # ORD-2026-0001
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    # datos del comprador (guest checkout también)
    customer_name = models.CharField(max_length=200)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)
    customer_rut = models.CharField(max_length=12, blank=True)
    # dirección de despacho
    shipping_address = models.TextField()
    shipping_city = models.CharField(max_length=100)
    shipping_region = models.CharField(max_length=100)
    # totales
    subtotal = models.DecimalField(max_digits=12, decimal_places=0)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=0, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=0)
    # estado y pago
    status = models.CharField(max_length=20, choices=STATUS, default='pending')
    payment_method = models.CharField(max_length=50, default='flow')
    flow_token = models.CharField(max_length=100, blank=True)
    flow_order = models.CharField(max_length=100, blank=True)
    # embroidery
    embroidery_notes = models.TextField(blank=True)    # instrucciones de bordado
    created_at = models.DateTimeField(auto_now_add=True)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey('products.Product', on_delete=models.PROTECT)
    variant = models.ForeignKey('products.ProductVariant', null=True, on_delete=models.SET_NULL)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=0)
    embroidery = models.BooleanField(default=False)
    embroidery_text = models.CharField(max_length=100, blank=True)
```

### Pagos Flow
```python
# apps/payments/models.py

class FlowPayment(models.Model):
    STATUS = [
        (1, 'Pendiente'),
        (2, 'Pagado'),
        (3, 'Rechazado'),
        (4, 'Anulado'),
    ]
    order = models.OneToOneField('orders.Order', on_delete=models.CASCADE)
    flow_token = models.CharField(max_length=100, unique=True)
    flow_order_id = models.CharField(max_length=100, blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=0)
    status = models.IntegerField(choices=STATUS, default=1)
    payment_date = models.DateTimeField(null=True, blank=True)
    raw_response = models.JSONField(default=dict)     # respuesta completa de Flow
    created_at = models.DateTimeField(auto_now_add=True)
```

---

## 🔌 API ENDPOINTS (Django REST Framework)

```
# Productos (públicos)
GET    /api/products/                    → listado con filtros
GET    /api/products/{slug}/             → detalle producto
GET    /api/categories/                  → árbol de categorías
GET    /api/lines/                       → líneas disponibles

# Filtros disponibles en /api/products/:
?category=vestuario-hombre
?line=iron
?size=XL
?min_price=10000&max_price=50000
?search=chaleco
?featured=true
?ordering=-created_at

# Órdenes
POST   /api/orders/                      → crear orden (guest o autenticado)
GET    /api/orders/{order_number}/       → detalle orden (requiere token o email)

# Pagos Flow
POST   /api/payments/flow/create/        → crear pago → retorna URL Flow
POST   /api/payments/flow/confirm/       → webhook Flow (notificación server-to-server)
GET    /api/payments/flow/return/        → retorno cliente después de pagar

# Cotizaciones corporativas
POST   /api/quotes/                      → enviar formulario de cotización

# Auth
POST   /api/auth/register/
POST   /api/auth/login/                  → retorna JWT access + refresh
POST   /api/auth/refresh/
GET    /api/auth/me/

# Admin (requiere is_staff=True)
GET    /api/admin/orders/                → listado órdenes con filtros
PATCH  /api/admin/orders/{id}/status/    → cambiar estado
GET    /api/admin/products/              → CRUD productos
POST   /api/admin/products/bulk-upload/  → carga masiva CSV
GET    /api/admin/reports/sales/         → reporte ventas
```

---

## 💳 INTEGRACIÓN FLOW.CL

### Flujo completo de pago
```
1. Cliente confirma carrito → POST /api/orders/ → se crea Order(status='pending')
2. Frontend llama → POST /api/payments/flow/create/
3. Backend genera firma HMAC-SHA256 y llama API Flow
4. Flow retorna {url, token} → backend guarda token → retorna URL al frontend
5. Frontend redirige al cliente a URL de Flow
6. Cliente paga en Flow (tarjeta, débito, transferencia)
7. Flow llama webhook → POST /api/payments/flow/confirm/ (server-to-server)
8. Backend valida, actualiza Order(status='paid'), envía email confirmación
9. Flow redirige cliente → GET /api/payments/flow/return/ → frontend muestra éxito
```

### Implementación backend
```python
# apps/payments/services.py
import hashlib, hmac, requests
from django.conf import settings

FLOW_API_URL = "https://www.flow.cl/api"  # sandbox: "https://sandbox.flow.cl/api"

def generar_firma(params: dict, secret: str) -> str:
    """Firma HMAC-SHA256 requerida por Flow"""
    keys_sorted = sorted(params.keys())
    to_sign = "".join(f"{k}{params[k]}" for k in keys_sorted)
    return hmac.new(secret.encode(), to_sign.encode(), hashlib.sha256).hexdigest()

def crear_pago_flow(order) -> dict:
    params = {
        "apiKey":          settings.FLOW_API_KEY,
        "commerceOrder":   order.order_number,
        "subject":         f"Pedido {order.order_number} - Distribuidora Manuel Mercado",
        "currency":        "CLP",
        "amount":          int(order.total),
        "email":           order.customer_email,
        "paymentMethod":   9,   # 9 = todos los medios disponibles
        "urlConfirmation": settings.FLOW_URL_CONFIRM,   # webhook
        "urlReturn":       settings.FLOW_URL_RETURN,    # retorno cliente
    }
    params["s"] = generar_firma(params, settings.FLOW_SECRET_KEY)
    response = requests.post(f"{FLOW_API_URL}/payment/create", data=params, timeout=30)
    response.raise_for_status()
    data = response.json()
    # URL final = data["url"] + "?token=" + data["token"]
    return data

def obtener_estado_pago(token: str) -> dict:
    params = {
        "apiKey": settings.FLOW_API_KEY,
        "token":  token,
    }
    params["s"] = generar_firma(params, settings.FLOW_SECRET_KEY)
    response = requests.get(f"{FLOW_API_URL}/payment/getStatus", params=params, timeout=30)
    return response.json()
```

### Variables de entorno Flow
```bash
# .env backend
FLOW_API_KEY=tu_api_key_flow
FLOW_SECRET_KEY=tu_secret_key_flow
FLOW_ENV=sandbox   # cambiar a "production" cuando esté listo
FLOW_URL_CONFIRM=https://tu-backend.onrender.com/api/payments/flow/confirm/
FLOW_URL_RETURN=https://tu-frontend.vercel.app/pedido-confirmado/
```

---

## 🎨 DISEÑO Y UI

### Identidad visual
- **Paleta principal:** Azul oscuro `#1A3C5E`, Azul medio `#2A6099`, Blanco `#FFFFFF`
- **Acento:** Naranja `#E65100` (para badges de oferta, bordado especial)
- **Neutros:** Gris texto `#4A4A4A`, Gris claro fondo `#F2F4F7`, Borde `#D0D5DD`
- **Tipografía:** Inter (cuerpo) + Sora o Barlow (display/títulos) — vía Google Fonts
- **Radio de bordes:** 8px tarjetas, 6px botones, 4px inputs
- **Sombras:** Suaves, sin exagerar — `shadow-sm` para tarjetas en reposo, `shadow-md` en hover

### Componentes clave

**ProductCard:**
- Imagen principal con hover que muestra segunda imagen
- Badge de línea (Practical, Iron, etc.) en esquina superior
- Badge "Con bordado" si `has_embroidery=true`
- Nombre, SKU, precio en CLP formateado
- Botón "Agregar al carrito" con animación de feedback
- Indicador de stock bajo (< 5 unidades)

**Navbar:**
- Logo + nombre distribuidora a la izquierda
- Menú de categorías (dropdown) al centro
- Buscador, carrito (con contador badge) y cuenta a la derecha
- Sticky con sombra al hacer scroll
- Menú hamburguesa en mobile

**FilterPanel (sidebar catálogo):**
- Categorías con acordeón
- Líneas como chips seleccionables
- Rango de precio con slider
- Tallas como botones tipo toggle
- Certificaciones como checkboxes
- Botón "Limpiar filtros"

**CartDrawer:**
- Drawer desde la derecha (no página aparte)
- Lista de items con imagen miniatura, variante, cantidad editable
- Subtotal actualizado en tiempo real
- Nota de bordado por item (texto libre)
- Botón "Ir al checkout"

### Páginas principales

**Home:**
- Hero con imagen full-width, tagline de la distribuidora y CTA
- Sección "Líneas Tworld" con cards de cada línea
- Productos destacados (is_featured=True)
- Banner de valor diferencial: "Bordado a medida · Distribuidor oficial · Despacho a todo Chile"
- Sección de categorías principales con imagen
- Footer con info de contacto, redes sociales, mapa de sitio

**Catálogo (`/productos`):**
- FilterPanel lateral (desktop) / drawer (mobile)
- ProductGrid con paginación (24 productos por página)
- Ordenamiento: Relevancia, Precio asc/desc, Más nuevo
- Breadcrumb con categoría activa
- Contador de resultados

**Detalle de producto (`/productos/{slug}`):**
- Galería con imagen principal + miniaturas
- Selector de talla y color (variantes)
- Descripción en tabs: General · Ficha Técnica · Certificaciones
- Opción de bordado: checkbox + campo de texto
- Botón agregar al carrito + botón cotización corporativa
- Productos relacionados (misma categoría)

---

## ⚙️ CONFIGURACIÓN DE DESPLIEGUE

### Variables de entorno — Frontend (Vercel)
```bash
VITE_API_URL=https://tu-backend.onrender.com
VITE_SITE_NAME=Distribuidora Manuel Mercado
VITE_FLOW_ENV=sandbox
```

### Variables de entorno — Backend (Render)
```bash
SECRET_KEY=genera-una-clave-larga-y-aleatoria
DEBUG=False
ALLOWED_HOSTS=tu-backend.onrender.com
DATABASE_URL=postgresql://...  # generado automáticamente por Render
CORS_ALLOWED_ORIGINS=https://tu-frontend.vercel.app
FLOW_API_KEY=...
FLOW_SECRET_KEY=...
FLOW_ENV=sandbox
FLOW_URL_CONFIRM=https://tu-backend.onrender.com/api/payments/flow/confirm/
FLOW_URL_RETURN=https://tu-frontend.vercel.app/pedido-confirmado/
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=tu-correo@gmail.com
EMAIL_HOST_PASSWORD=app-password-gmail
DEFAULT_FROM_EMAIL=Distribuidora Manuel Mercado <tu-correo@gmail.com>
```

### `render.yaml` (raíz del backend)
```yaml
services:
  - type: web
    name: tworld-backend
    env: python
    buildCommand: pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
    startCommand: gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
    envVars:
      - key: DJANGO_SETTINGS_MODULE
        value: config.settings.production
      - key: SECRET_KEY
        generateValue: true
      - key: DATABASE_URL
        fromDatabase:
          name: tworld-db
          property: connectionString

databases:
  - name: tworld-db
    plan: free
```

### `vite.config.js`
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
  }
})
```

---

## 📦 DEPENDENCIAS

### Frontend (`package.json`)
```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^6.28.0",
    "zustand": "^5.0.0",
    "axios": "^1.7.0",
    "@tanstack/react-query": "^5.0.0",
    "react-hot-toast": "^2.4.1",
    "react-image-gallery": "^1.3.0",
    "react-slider": "^2.0.6",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^6.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### Backend (`requirements.txt`)
```
Django==5.1.4
djangorestframework==3.15.2
djangorestframework-simplejwt==5.3.1
django-cors-headers==4.6.0
django-filter==24.3
Pillow==11.0.0
psycopg2-binary==2.9.10
gunicorn==23.0.0
python-decouple==3.8
requests==2.32.3
whitenoise==6.8.2
```

---

## 🚦 REGLAS Y CONVENCIONES DE CÓDIGO

### Frontend
- Componentes en PascalCase: `ProductCard.jsx`
- Hooks personalizados en camelCase con prefijo `use`: `useProducts.js`
- Stores Zustand en camelCase con sufijo `Store`: `cartStore.js`
- Servicios API en camelCase: `products.js`
- Usar `@tanstack/react-query` para fetching y caché de datos del servidor
- Zustand solo para estado cliente (carrito, filtros, sesión)
- Formatear precios siempre con `formatCLP(precio)` → `$12.990`
- Nunca hardcodear la URL de la API, siempre usar `import.meta.env.VITE_API_URL`

### Backend
- Apps Django en carpeta `apps/` para mantener orden
- Serializers separados por carpeta: `serializers/list.py`, `serializers/detail.py`
- Vistas basadas en `ModelViewSet` de DRF con `FilterSet` para filtros
- Autenticación JWT con `SimpleJWT`
- Permisos: `IsAuthenticated` para órdenes, `IsAdminUser` para panel admin
- Webhook de Flow debe verificar la firma antes de procesar
- Logs en producción con `logging` de Django

---

## ✅ ORDEN DE DESARROLLO RECOMENDADO

### Fase 1 — Base del proyecto (Semana 1)
1. Crear estructura monorepo en GitHub
2. Configurar Django: settings, apps vacías, JWT, CORS
3. Configurar Vite + Tailwind + React Router + Zustand
4. Implementar modelos: Category, Product, ProductImage, ProductVariant, Certificate
5. Crear fixtures con datos de prueba (5-10 productos Tworld)
6. Endpoint GET `/api/products/` y `/api/categories/`

### Fase 2 — Frontend catálogo (Semanas 2-3)
1. Navbar + Footer
2. Página Home (hero, categorías, destacados)
3. Página Catálogo con FilterPanel y ProductGrid
4. Página Detalle de producto con galería y variantes
5. CartDrawer con Zustand (sin backend aún)

### Fase 3 — Backend órdenes y pagos (Semanas 3-5)
1. Modelos Order y OrderItem
2. Endpoint POST `/api/orders/`
3. Integración Flow.cl: crear pago, webhook, estado
4. Modelo FlowPayment
5. Emails de confirmación con Django email

### Fase 4 — Checkout y autenticación (Semana 6)
1. Página Checkout con formulario de datos
2. Flujo completo: carrito → checkout → Flow → confirmación
3. Registro y login de usuarios
4. Historial de pedidos del cliente
5. Formulario de cotización corporativa

### Fase 5 — Panel admin y despliegue (Semanas 7-8)
1. Dashboard con métricas básicas
2. Gestión de productos (CRUD + carga CSV)
3. Gestión de órdenes con cambio de estado
4. Configuración Vercel + Render + PostgreSQL
5. Variables de entorno producción
6. Pruebas end-to-end del flujo de compra
7. Capacitación a Manuel Mercado

---

## 🔐 CONSIDERACIONES DE SEGURIDAD

- Nunca exponer `SECRET_KEY` ni credenciales Flow en el repositorio
- Usar `.env` local + variables de entorno en Render/Vercel
- El webhook de Flow debe verificar la firma HMAC antes de procesar
- CORS configurado solo para el dominio del frontend en producción
- Rate limiting en endpoints de creación de órdenes (evitar spam)
- Validar RUT chileno en el backend antes de procesar orden
- Imágenes subidas: validar tipo MIME y tamaño máximo (5MB por imagen)

---

## 📝 NOTAS FINALES PARA EL ASISTENTE

- Cuando generes código, **siempre** indica en qué archivo va (`# apps/products/models.py`)
- Si necesitas crear un archivo nuevo, explica su propósito antes de escribirlo
- Usa **español** para comentarios en el código (el cliente y el dev son chilenos)
- Los precios en CLP **no llevan decimales** — usar `DecimalField(decimal_places=0)`
- El bordado es una característica diferenciadora — siempre considerar el campo `embroidery` en los flujos
- Flow.cl en sandbox usa la URL `https://sandbox.flow.cl/api` — en producción `https://www.flow.cl/api`
- Para formatear precios en el frontend: `new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(precio)`
- Render en plan gratuito tiene cold start — en producción usar plan Starter ($7 USD/mes)
