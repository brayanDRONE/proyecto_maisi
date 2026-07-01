from django.db import models


class Quote(models.Model):
    """Cotizaciones corporativas sin pago online"""
    STATUS_CHOICES = [
        ('pending', 'Pendiente de revisión'),
        ('reviewed', 'Revisada'),
        ('sent', 'Cotización enviada'),
        ('approved', 'Aprobada'),
        ('rejected', 'Rechazada'),
    ]

    company_name = models.CharField(max_length=200)
    contact_name = models.CharField(max_length=200)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20)
    rut = models.CharField(max_length=12)
    details = models.TextField()
    estimated_quantity = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Quote {self.id} - {self.company_name}"
