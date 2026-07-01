from django_filters import rest_framework as filters
from .models import Product


class ProductFilter(filters.FilterSet):
    """
    Filtros disponibles en /api/products/:
    ?category=vestuario-hombre
    ?line=iron
    ?size=XL
    ?min_price=10000&max_price=50000
    ?search=chaleco
    ?featured=true
    """
    category = filters.CharFilter(field_name='category__slug', lookup_expr='exact')
    line = filters.CharFilter(field_name='line__slug', lookup_expr='exact')
    min_price = filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = filters.NumberFilter(field_name='price', lookup_expr='lte')
    size = filters.CharFilter(method='filter_by_size')
    featured = filters.BooleanFilter(field_name='is_featured')

    class Meta:
        model = Product
        fields = ['category', 'line', 'min_price', 'max_price', 'size', 'featured']

    def filter_by_size(self, queryset, name, value):
        """Filtra productos que tengan la talla solicitada con stock"""
        return queryset.filter(variants__size=value, variants__stock__gt=0).distinct()
