#!/usr/bin/env python
"""Administrador de Django para proyecto Tworld Distribuidor."""
import os
import sys


def main():
    """Ejecuta el administrador de Django."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "No se pudo importar Django. ¿Está instalado y disponible en tu "
            "PYTHONPATH ambiente?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
