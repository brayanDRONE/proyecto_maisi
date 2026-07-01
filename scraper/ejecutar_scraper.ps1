# Script de Scraping e Importación Automática para Tworld
# Ejecutar desde PowerShell

param(
    [switch]$SkipScrape = $false,
    [switch]$SkipImport = $false
)

$projectRoot = "C:\proyecto_maisi"
$scraperDir = "$projectRoot\scraper"
$backendDir = "$projectRoot\backend"
$jsonFile = "$scraperDir\productos_scrapedos.json"

Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🚀 SISTEMA DE SCRAPING E IMPORTACIÓN - TWORLD DISTRIBUIDOR" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Scraping
if (-not $SkipScrape) {
    Write-Host "📁 PASO 1: Ejecutando Scraper..." -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
    
    if (-not (Test-Path $scraperDir)) {
        Write-Host "❌ Directorio del scraper no encontrado: $scraperDir" -ForegroundColor Red
        exit 1
    }
    
    cd $scraperDir
    
    # Verificar si node_modules existe
    if (-not (Test-Path "$scraperDir\node_modules")) {
        Write-Host "📦 Instalando dependencias npm..." -ForegroundColor Cyan
        npm install
    }
    
    # Ejecutar scraper
    Write-Host "🔄 Scapeando tworldstore.cl..." -ForegroundColor Cyan
    & node scraper_mejorado.js
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error en el scraper" -ForegroundColor Red
        exit 1
    }
    
    if (-not (Test-Path $jsonFile)) {
        Write-Host "❌ Archivo JSON no generado" -ForegroundColor Red
        exit 1
    }
    
    $fileSize = (Get-Item $jsonFile).Length / 1MB
    Write-Host "✅ Scraper completado. Archivo: $jsonFile ($([math]::Round($fileSize, 2)) MB)" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "⏭️ Saltando scraper (--SkipScrape)" -ForegroundColor Gray
}

# Paso 2: Importación a BD
if (-not $SkipImport) {
    Write-Host "💾 PASO 2: Importando a Base de Datos..." -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
    
    if (-not (Test-Path $backendDir)) {
        Write-Host "❌ Directorio del backend no encontrado: $backendDir" -ForegroundColor Red
        exit 1
    }
    
    cd $backendDir
    
    # Verificar si venv existe
    $venvPath = "$backendDir\venv\Scripts\python.exe"
    $pythonExe = if (Test-Path $venvPath) { $venvPath } else { "python" }
    
    Write-Host "🔄 Ejecutando comando de importación..." -ForegroundColor Cyan
    & $pythonExe manage.py import_products $jsonFile
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error en la importación" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Importación completada" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "⏭️ Saltando importación (--SkipImport)" -ForegroundColor Gray
}

# Resumen final
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  ✅ PROCESO COMPLETADO CON ÉXITO" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
Write-Host "  1. Verificar que el backend está corriendo:"
Write-Host "     python manage.py runserver" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. En otra terminal, iniciar el frontend:"
Write-Host "     cd $projectRoot\frontend"
Write-Host "     npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Abrir http://localhost:5173/productos" -ForegroundColor Gray
Write-Host "     Las imágenes deberían verse correctamente" -ForegroundColor Gray
Write-Host ""
