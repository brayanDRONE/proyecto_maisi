from .base import *
import dj_database_url
from urllib.parse import urlparse


def _normalize_origin(value):
    raw = (value or '').strip().rstrip('/')
    if not raw:
        return ''

    parsed = urlparse(raw)
    if not parsed.scheme or not parsed.netloc:
        return ''

    return f'{parsed.scheme}://{parsed.netloc}'


def _normalize_origin_list(values):
    normalized = []
    for item in values:
        origin = _normalize_origin(item)
        if origin and origin not in normalized:
            normalized.append(origin)
    return normalized

# Producción
DEBUG = False
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1', cast=Csv())

# Base de datos - PostgreSQL en Render usando DATABASE_URL
DATABASE_URL = config('DATABASE_URL', default='')
if DATABASE_URL:
    DATABASES = {
        'default': dj_database_url.parse(DATABASE_URL, conn_max_age=600, ssl_require=True)
    }

# Email en producción
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# CORS restrictivo en producción
CORS_ALLOWED_ORIGINS = _normalize_origin_list(
    config('CORS_ALLOWED_ORIGINS', default='', cast=Csv())
)
CSRF_TRUSTED_ORIGINS = _normalize_origin_list(
    config('CSRF_TRUSTED_ORIGINS', default='', cast=Csv())
)

# Seguridad
SECURE_SSL_REDIRECT = config('SECURE_SSL_REDIRECT', default=True, cast=bool)
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_HSTS_SECONDS = config('SECURE_HSTS_SECONDS', default=31536000, cast=int)
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# WhiteNoise para archivos estáticos
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
