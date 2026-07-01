from rest_framework import serializers
from ..models import Category, Line, Product, ProductImage, ProductVariant, Certificate
from .list import CategoryListSerializer, LineListSerializer


class ProductImageSerializer(serializers.ModelSerializer):
    """Imágenes del producto para la galería"""

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'order']


class ProductVariantSerializer(serializers.ModelSerializer):
    """Variantes de talla y color"""

    class Meta:
        model = ProductVariant
        fields = ['id', 'size', 'color', 'color_hex', 'stock']


class CertificateSerializer(serializers.ModelSerializer):
    """Certificaciones del producto (DICTUC, normas técnicas)"""

    class Meta:
        model = Certificate
        fields = ['id', 'name', 'issuer', 'file', 'valid_until', 'created_at']


class CategoryDetailSerializer(serializers.ModelSerializer):
    """Categoría con sus subcategorías (árbol)"""
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image', 'order', 'children']

    def get_children(self, obj):
        return CategoryListSerializer(obj.children.all().order_by('order', 'name'), many=True).data


class ProductDetailSerializer(serializers.ModelSerializer):
    """Detalle completo del producto — para la página de detalle"""
    category = CategoryListSerializer(read_only=True)
    line = LineListSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    certificates = CertificateSerializer(many=True, read_only=True)
    # Tallas únicas disponibles para el selector
    available_sizes = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'sku', 'name', 'slug',
            'category', 'line',
            'description', 'technical_sheet',
            'price', 'stock',
            'is_active', 'is_featured', 'has_embroidery',
            'images', 'variants', 'certificates',
            'available_sizes',
            'created_at', 'updated_at',
        ]

    def get_available_sizes(self, obj):
        """Retorna lista de tallas disponibles (con stock > 0)"""
        return list(
            obj.variants.filter(stock__gt=0)
               .values_list('size', flat=True)
               .distinct()
               .order_by('size')
        )
