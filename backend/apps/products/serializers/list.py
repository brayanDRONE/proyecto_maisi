from rest_framework import serializers
from ..models import Category, Line, Product, ProductImage


class CategoryListSerializer(serializers.ModelSerializer):
    """Serializer liviano de categoría para listados"""

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image', 'order']


class LineListSerializer(serializers.ModelSerializer):
    """Serializer liviano de línea Tworld para listados"""

    class Meta:
        model = Line
        fields = ['id', 'name', 'slug', 'description', 'image']


class ProductImageMinSerializer(serializers.ModelSerializer):
    """Imagen reducida para tarjeta de producto"""

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order']


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer para la grilla del catálogo — sólo campos esenciales"""
    category = CategoryListSerializer(read_only=True)
    line = LineListSerializer(read_only=True)
    primary_image = serializers.SerializerMethodField()
    secondary_image = serializers.SerializerMethodField()
    all_images = serializers.SerializerMethodField()
    variants = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'sku', 'name', 'slug',
            'category', 'line',
            'price', 'stock',
            'is_featured', 'has_embroidery',
            'primary_image', 'secondary_image', 'all_images',
            'variants',
            'created_at',
        ]

    def get_primary_image(self, obj):
        """Retorna la URL de la imagen primaria del producto"""
        image = obj.images.filter(is_primary=True).first() or obj.images.first()
        if image and image.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(image.image.url)
        return None

    def get_secondary_image(self, obj):
        """Retorna la URL de la imagen secundaria (segunda imagen o la primera si no existe)"""
        images = list(obj.images.all().order_by('order'))
        if len(images) > 1:
            image = images[1]
            if image.image:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(image.image.url)
        # Si no hay segunda imagen, devolver la primera
        return self.get_primary_image(obj)

    def get_all_images(self, obj):
        """Retorna todas las URLs de imágenes del producto"""
        images = []
        for img in obj.images.all().order_by('order'):
            if img.image:
                request = self.context.get('request')
                if request:
                    images.append(request.build_absolute_uri(img.image.url))
        return images

    def get_variants(self, obj):
        """Retorna variantes (colores y tallas)"""
        colors = {}
        sizes = []
        
        for variant in obj.variants.all():
            # Agrupar colores
            if variant.color and variant.color != 'DEFAULT':
                if variant.color not in colors:
                    colors[variant.color] = {
                        'name': variant.color,
                        'hex': variant.color_hex or '#cccccc'
                    }
            # Recolectar tallas
            if variant.size and variant.size != 'ONESIZE' and variant.size not in sizes:
                sizes.append(variant.size)
        
        return {
            'colors': list(colors.values()),
            'sizes': sorted(sizes)
        }
