import json
import os
import re
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from apps.products.models import Category, Product, ProductImage, ProductVariant, Line
import requests
from django.core.files.base import ContentFile
import tempfile


class Command(BaseCommand):
    help = 'Importa productos desde JSON del scraper'

    def add_arguments(self, parser):
        parser.add_argument('json_file', type=str, help='Ruta del archivo JSON con productos')

    def _normalize_sku(self, raw_sku, fallback='00000'):
        digits = re.sub(r'\D', '', str(raw_sku or ''))
        if len(digits) >= 5:
            return digits[:5]
        if digits:
            return digits
        return str(fallback)[:5] or '00000'

    def _normalize_category(self, raw_category):
        value = str(raw_category or '').strip().lower()
        if 'hombre' in value:
            return 'Vestuario Hombre'
        if 'mujer' in value:
            return 'Vestuario Mujer'
        return None

    def handle(self, *args, **options):
        json_file = options['json_file']

        if not os.path.exists(json_file):
            self.stdout.write(self.style.ERROR(f'Archivo no encontrado: {json_file}'))
            return

        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)

        products_data = data.get('products', [])
        self.stdout.write(f'📦 Importando {len(products_data)} productos...\n')

        created_count = 0
        updated_count = 0
        skipped_count = 0
        error_count = 0

        for prod_data in products_data:
            try:
                category_name = self._normalize_category(prod_data.get('category'))
                if not category_name:
                    skipped_count += 1
                    continue

                product_name = prod_data.get('name', 'Producto sin nombre')
                product_sku = self._normalize_sku(prod_data.get('sku'), prod_data.get('id'))
                product_slug = f"{slugify(product_name)}-{prod_data.get('id', product_sku)}"
                
                # Obtener o crear categoría
                category, _ = Category.objects.get_or_create(
                    name=category_name,
                    defaults={
                        'slug': slugify(category_name),
                        'order': 0
                    }
                )

                # Obtener o crear producto
                product, created = Product.objects.get_or_create(
                    sku=product_sku,
                    defaults={
                        'name': product_name,
                        'slug': product_slug,
                        'category': category,
                        'description': '',
                        'price': prod_data.get('price', 0),
                        'stock': 100,  # Stock por defecto
                        'is_active': True,
                        'is_featured': prod_data.get('isFeatured', False),
                        'has_embroidery': prod_data.get('hasEmbroidery', True),
                    }
                )

                if created:
                    created_count += 1
                    status = '✨ CREADO'
                else:
                    updated_count += 1
                    status = '🔄 ACTUALIZADO'
                    product.name = product_name
                    product.slug = product_slug
                    product.category = category
                    product.price = prod_data.get('price', product.price)
                    product.is_featured = prod_data.get('isFeatured', product.is_featured)
                    product.has_embroidery = prod_data.get('hasEmbroidery', product.has_embroidery)
                    product.save(update_fields=['name', 'slug', 'category', 'price', 'is_featured', 'has_embroidery'])

                # Limpiar imágenes anteriores si es actualización
                if not created:
                    product.images.all().delete()
                    product.variants.all().delete()

                # Descargar e importar imágenes
                images_list = prod_data.get('images', [])
                if isinstance(images_list, str):
                    images_list = [images_list]
                
                if not images_list and prod_data.get('primaryImage'):
                    images_list = [prod_data.get('primaryImage')]

                for idx, img_url in enumerate(images_list[:5]):  # Máximo 5 imágenes
                    try:
                        self._save_product_image(product, img_url, idx == 0)
                    except Exception as e:
                        self.stdout.write(f'    ⚠️ Error guardando imagen: {str(e)[:50]}')

                # Importar variantes (colores)
                colors = prod_data.get('colors', [])
                for color in colors:
                    try:
                        color_name = color.get('name') if isinstance(color, dict) else color
                        ProductVariant.objects.get_or_create(
                            product=product,
                            size='ONESIZE',
                            color=color_name,
                            defaults={
                                'color_hex': color.get('hex', '') if isinstance(color, dict) else '',
                                'stock': 50,
                            }
                        )
                    except Exception as e:
                        pass

                # Importar variantes (tallas)
                sizes = prod_data.get('sizes', [])
                for size in sizes:
                    try:
                        size_name = size.get('name') if isinstance(size, dict) else size
                        ProductVariant.objects.get_or_create(
                            product=product,
                            size=size_name,
                            color='DEFAULT',
                            defaults={'stock': 50}
                        )
                    except Exception as e:
                        pass

                self.stdout.write(f'{status}: {product.name} ({len(images_list)} imágenes)')

            except Exception as e:
                error_count += 1
                self.stdout.write(self.style.ERROR(f'❌ Error: {str(e)[:80]}'))

        self.stdout.write(self.style.SUCCESS(f'\n✅ Importación completada:'))
        self.stdout.write(f'  ✨ Creados: {created_count}')
        self.stdout.write(f'  🔄 Actualizados: {updated_count}')
        self.stdout.write(f'  ⏭️ Omitidos (no Hombre/Mujer): {skipped_count}')
        self.stdout.write(f'  ❌ Errores: {error_count}')

    def _save_product_image(self, product, img_url, is_primary=False):
        """Descarga y guarda una imagen del producto"""
        try:
            response = requests.get(img_url, timeout=10)
            response.raise_for_status()

            # Extraer nombre del archivo de la URL
            filename = img_url.split('/')[-1]
            if not filename or '?' in filename:
                filename = f"product_{product.id}_{product.images.count()}.jpg"

            # Crear ProductImage
            product_image = ProductImage(
                product=product,
                is_primary=is_primary,
                alt_text=product.name,
                order=product.images.count()
            )

            # Guardar la imagen
            product_image.image.save(
                filename,
                ContentFile(response.content),
                save=True
            )

        except Exception as e:
            raise Exception(f'Error descargando {img_url}: {str(e)}')
