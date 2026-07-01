from .base import *

# Producción
DEBUG = False
ALLOWED_HOSTS = ['tu-backend.onrender.com']

# Base de datos - PostgreSQL en producción
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME', default='tworld_db'),
        'USER': config('DB_USER', default='postgres'),
        'PASSWORD': config('DB_PASSWORD', default=''),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='5432'),
    }
}

# Email en producción
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# CORS restrictivo en producción
CORS_ALLOWED_ORIGINS = [
    'https://tu-frontend.vercel.app',
]

# Seguridad
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# WhiteNoise para archivos estáticos
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
