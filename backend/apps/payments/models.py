from django.db import models


class FlowPayment(models.Model):
    """Pagos a través de Flow.cl"""
    STATUS_CHOICES = [
        (1, 'Pendiente'),
        (2, 'Pagado'),
        (3, 'Rechazado'),
        (4, 'Anulado'),
    ]

    order = models.OneToOneField('orders.Order', on_delete=models.CASCADE)
    flow_token = models.CharField(max_length=100, unique=True)
    flow_order_id = models.CharField(max_length=100, blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=0)
    status = models.IntegerField(choices=STATUS_CHOICES, default=1)
    payment_date = models.DateTimeField(null=True, blank=True)
    raw_response = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Payment {self.flow_token} - Status {self.status}"
