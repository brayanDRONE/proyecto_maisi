from django.db import models
from django.conf import settings


class Order(models.Model):
    """Órdenes de compra"""
    STATUS_CHOICES = [
        ('pending', 'Pendiente de pago'),
        ('paid', 'Pagado'),
        ('preparing', 'En preparación'),
        ('shipped', 'Despachado'),
        ('delivered', 'Entregado'),
        ('cancelled', 'Cancelado'),
    ]

    order_number = models.CharField(max_length=20, unique=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    customer_name = models.CharField(max_length=200)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)
    customer_rut = models.CharField(max_length=12, blank=True)
    shipping_address = models.TextField()
    shipping_city = models.CharField(max_length=100)
    shipping_region = models.CharField(max_length=100)
    subtotal = models.DecimalField(max_digits=12, decimal_places=0)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=0, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=50, default='flow')
    flow_token = models.CharField(max_length=100, blank=True)
    flow_order = models.CharField(max_length=100, blank=True)
    embroidery_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order {self.order_number}"


class OrderItem(models.Model):
    """Items dentro de una orden"""
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey('products.Product', on_delete=models.PROTECT)
    variant = models.ForeignKey('products.ProductVariant', null=True, on_delete=models.SET_NULL)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=0)
    embroidery = models.BooleanField(default=False)
    embroidery_text = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.product.name} x{self.quantity}"
