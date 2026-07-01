from rest_framework import viewsets, filters
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend

from .models import Category, Line, Product
from .serializers import (
    CategoryListSerializer, CategoryDetailSerializer,
    LineListSerializer,
    ProductListSerializer, ProductDetailSerializer,
)
from .filters import ProductFilter


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/categories/         → árbol de categorías raíz con hijos
    GET /api/categories/{slug}/  → detalle de categoría
    """
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        if self.action == 'list':
            # Solo categorías raíz — los hijos vienen en el serializer
            return Category.objects.filter(parent=None).prefetch_related('children').order_by('order', 'name')
        return Category.objects.all().prefetch_related('children').order_by('order', 'name')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CategoryDetailSerializer
        return CategoryListSerializer


class LineViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/lines/         → listado de líneas Tworld
    GET /api/lines/{slug}/  → detalle de línea
    """
    queryset = Line.objects.all().order_by('name')
    serializer_class = LineListSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/products/          → catálogo con filtros y paginación (24/página)
    GET /api/products/{slug}/   → detalle completo del producto

    Filtros: ?category=slug &line=slug &size=XL &min_price=N &max_price=N &featured=true
    Búsqueda: ?search=chaleco
    Orden: ?ordering=price | -price | name | -created_at
    """
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'sku']
    ordering_fields = ['created_at', 'price', 'name']
    ordering = ['-created_at']

    def get_queryset(self):
        return (
            Product.objects
            .filter(is_active=True)
            .select_related('category', 'line')
            .prefetch_related('images', 'variants', 'certificates')
        )

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer
