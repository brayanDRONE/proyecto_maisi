from django.contrib import admin
from .models import Category, Line, Product, ProductImage, ProductVariant, Certificate


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image', 'alt_text', 'is_primary', 'order']


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1
    fields = ['size', 'color', 'color_hex', 'stock']


class CertificateInline(admin.TabularInline):
    model = Certificate
    extra = 0
    fields = ['name', 'issuer', 'file', 'valid_until']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'parent', 'order']
    list_filter = ['parent']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['order', 'name']


@admin.register(Line)
class LineAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    search_fields = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['sku', 'name', 'category', 'line', 'price', 'stock', 'is_active', 'is_featured', 'has_embroidery']
    list_filter = ['category', 'line', 'is_active', 'is_featured', 'has_embroidery']
    search_fields = ['sku', 'name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at']
    inlines = [ProductImageInline, ProductVariantInline, CertificateInline]
    fieldsets = (
        ('Información principal', {
            'fields': ('sku', 'name', 'slug', 'category', 'line', 'description', 'technical_sheet')
        }),
        ('Precio y stock', {
            'fields': ('price', 'stock')
        }),
        ('Opciones', {
            'fields': ('is_active', 'is_featured', 'has_embroidery')
        }),
        ('Fechas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
