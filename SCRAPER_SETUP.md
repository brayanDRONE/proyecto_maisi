# 🚀 Proceso de Scraping e Importación de Productos Tworld

## Paso 1: Ejecutar el Scraper Mejorado

El nuevo scraper está diseñado para:
- ✅ Capturar TODOS los productos de cada categoría con paginación
- ✅ Descargar TODAS las imágenes de cada producto
- ✅ Extraer colores y tallas reales
- ✅ Manejar URLs absolutas correctamente

### Desde Windows PowerShell:

```powershell
# Navegar a la carpeta del scraper
cd C:\proyecto_maisi\scraper

# Instalar dependencias si no las tiene
npm install

# Ejecutar el scraper mejorado
node scraper_mejorado.js
```

**Salida esperada:**
- El scraper creará `productos_scrapedos.json` con todos los datos
- También actualizará `frontend/src/utils/mockData.js`
- El proceso puede tomar 5-10 minutos dependiendo de la cantidad de productos

---

## Paso 2: Importar Productos a la Base de Datos

Una vez generado el JSON, importarlo a la BD Django:

### Desde PowerShell (en la carpeta backend):

```powershell
cd C:\proyecto_maisi\backend

# Activar ambiente virtual (si lo tiene)
# .\venv\Scripts\Activate.ps1

# Ejecutar el comando de importación
python manage.py import_products C:\proyecto_maisi\scraper\productos_scrapedos.json
```

**El comando hará:**
- ✅ Crear/actualizar categorías
- ✅ Crear/actualizar productos
- ✅ Descargar imágenes a `media/products/`
- ✅ Crear variantes de colores y tallas
- ✅ Mostrar reporte de importación

---

## Paso 3: Verificar en el Frontend

Una vez importados:

1. **Asegurar que el frontend apunta a la API correcta:**
   - En `.env` o `vite.config.js`, verificar: `VITE_API_URL=http://localhost:8000`

2. **Ejecutar el frontend:**
   ```powershell
   cd C:\proyecto_maisi\frontend
   npm run dev
   ```

3. **Verificar que las imágenes se ven:**
   - Ir a `http://localhost:5173/productos`
   - Las imágenes deberían mostrase correctamente
   - Al pasar el ratón, debería cambiar a la segunda imagen

---

## 🔧 Solución de Problemas

### Las imágenes no se ven
- [ ] Verificar que el backend está corriendo: `python manage.py runserver`
- [ ] Verificar que VITE_API_URL es correcto
- [ ] Revisar la consola del navegador (F12 → Console)
- [ ] Revisar que las imágenes existen en `backend/media/products/`

### El scraper se congela
- [ ] Las URLs están lentas. Esperar unos minutos.
- [ ] Alguna categoría puede no existir. El scraper continuará con la siguiente.

### Los productos se ven pero no las imágenes
- [ ] El backend no está sirviendo archivos multimedia
- [ ] Verificar `MEDIA_URL` y `MEDIA_ROOT` en `settings.py`

---

## 📊 Monitoreo del Progreso

**Consola del scraper:**
```
🚀 Iniciando scraper mejorado para Tworld...

📁 Scrapeando categoría: Hombre
  📄 Página 1: https://tworldstore.cl/10-hombre
  ✓ Encontrados 24 productos en página 1
    🔍 Obteniendo detalles de: Polera Practical Hombre...
    ✓ Polera Practical Hombre - 5 colores, 8 tallas
    ...
  📄 Página 2: https://tworldstore.cl/10-hombre?page=2
  ✓ Encontrados 0 productos en página 2
  ✅ Categoría completa: 48 productos
```

**Consola del import:**
```
📦 Importando 48 productos...
✨ CREADO: Polera Practical Hombre (3 imágenes)
🔄 ACTUALIZADO: Pantalón Jeans Iron Hombre (5 imágenes)
...
✅ Importación completada:
  ✨ Creados: 45
  🔄 Actualizados: 3
  ❌ Errores: 0
```

---

## 📝 Notas Importantes

1. **Pesos de imágenes**: El scraper descarga imágenes originales. Si son muy pesadas, considerar usar un servicio de CDN o redimensionar.

2. **Stock**: Por defecto se carga con stock de 50 unidades por variante. Ajustar según necesidad.

3. **Reutilización**: Correr nuevamente el scraper e importación solo actualizará productos existentes que cambien.

4. **URLs absolutas**: El scraper siempre guarda URLs completas (con https://) para evitar problemas de rutas.
