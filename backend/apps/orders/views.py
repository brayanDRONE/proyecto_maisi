import io
import base64
from datetime import datetime

from django.core.mail import EmailMessage
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

from .models import OrderLog


def _next_order_number(customer_name, customer_email, total):
    log = OrderLog.objects.create(
        customer_name=customer_name,
        customer_email=customer_email,
        total=total,
    )
    return f'#{log.pk:06d}'


def _format_clp(amount):
    try:
        return f"${int(amount):,}".replace(',', '.')
    except (TypeError, ValueError):
        return str(amount)


def _generate_pdf(order_number, form, items, total):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=2 * cm,
        leftMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
    )

    styles = getSampleStyleSheet()
    brand_style = ParagraphStyle('Brand', parent=styles['Title'], fontSize=20,
                                 textColor=colors.HexColor('#1a1a1a'), spaceAfter=2)
    sub_style = ParagraphStyle('Sub', parent=styles['Normal'], fontSize=9,
                                textColor=colors.HexColor('#666666'), spaceAfter=16)
    section_style = ParagraphStyle('Section', parent=styles['Normal'], fontSize=10,
                                   fontName='Helvetica-Bold', textColor=colors.HexColor('#1a1a1a'),
                                   spaceBefore=14, spaceAfter=5)
    normal_style = ParagraphStyle('Body', parent=styles['Normal'], fontSize=9,
                                  textColor=colors.HexColor('#333333'), spaceAfter=3)
    footer_style = ParagraphStyle('Footer', parent=styles['Normal'], fontSize=7.5,
                                  textColor=colors.HexColor('#888888'), alignment=TA_CENTER)

    elems = []

    # ── Header ──
    elems.append(Paragraph('MAISI', brand_style))
    elems.append(Paragraph('Bordado y Personalización', sub_style))

    # ── Order header table ──
    hdr_data = [
        ['CONFIRMACIÓN DE PEDIDO', ''],
        ['N° de Orden:', order_number],
        ['Fecha:', datetime.now().strftime('%d/%m/%Y  %H:%M')],
        ['Estado:', 'Pendiente de confirmación'],
    ]
    hdr_table = Table(hdr_data, colWidths=[4 * cm, 12 * cm])
    hdr_table.setStyle(TableStyle([
        ('SPAN', (0, 0), (1, 0)),
        ('FONTNAME', (0, 0), (1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (1, 0), 13),
        ('BACKGROUND', (0, 0), (1, 0), colors.HexColor('#f0f0f0')),
        ('TOPPADDING', (0, 0), (1, 0), 8),
        ('BOTTOMPADDING', (0, 0), (1, 0), 8),
        ('LEFTPADDING', (0, 0), (1, 0), 8),
        ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#333333')),
        ('TOPPADDING', (0, 1), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 3),
    ]))
    elems.append(hdr_table)
    elems.append(Spacer(1, 0.4 * cm))

    # ── Client data ──
    elems.append(Paragraph('DATOS DEL CLIENTE', section_style))
    client_rows = [
        ['Nombre:', form.get('nombre', '')],
        ['RUT:', form.get('rut', '')],
        ['Teléfono:', form.get('telefono', '')],
        ['Email:', form.get('email', '')],
    ]
    if form.get('empresa'):
        client_rows.append(['Empresa:', form['empresa']])

    client_table = Table(client_rows, colWidths=[3.5 * cm, 12.5 * cm])
    client_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#333333')),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
    ]))
    elems.append(client_table)

    # ── Shipping ──
    elems.append(Paragraph('DIRECCIÓN DE DESPACHO', section_style))
    shipping_table = Table([
        ['Dirección:', form.get('direccion', '')],
        ['Ciudad:', form.get('ciudad', '')],
        ['Región:', form.get('region', '')],
    ], colWidths=[3.5 * cm, 12.5 * cm])
    shipping_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#333333')),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
    ]))
    elems.append(shipping_table)

    # ── Products ──
    cell_style = ParagraphStyle('Cell', parent=styles['Normal'], fontSize=9,
                                 textColor=colors.HexColor('#333333'), leading=12)
    header_cell_style = ParagraphStyle('HeaderCell', parent=styles['Normal'], fontSize=9,
                                       fontName='Helvetica-Bold', textColor=colors.white, leading=12)

    elems.append(Paragraph('PRODUCTOS', section_style))
    prod_rows = [[
        Paragraph('Producto', header_cell_style),
        Paragraph('Detalle', header_cell_style),
        Paragraph('Cant.', header_cell_style),
        Paragraph('P. Unit.', header_cell_style),
        Paragraph('Subtotal', header_cell_style),
    ]]
    for item in items:
        variant = item.get('variant') or {}
        size = variant.get('size', '')
        color_val = variant.get('color', '')
        parts = []
        if size:
            parts.append(f'Talla {size}')
        if color_val:
            parts.append(color_val)
        detail = ' / '.join(parts) if parts else '-'
        price = item.get('product', {}).get('price', 0)
        qty = item.get('quantity', 1)
        prod_rows.append([
            Paragraph(item.get('product', {}).get('name', ''), cell_style),
            Paragraph(detail, cell_style),
            Paragraph(str(qty), cell_style),
            Paragraph(_format_clp(price), cell_style),
            Paragraph(_format_clp(price * qty), cell_style),
        ])

    prod_table = Table(prod_rows, colWidths=[6 * cm, 3.5 * cm, 1.5 * cm, 2.5 * cm, 2.5 * cm])
    prod_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a1a1a')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('ALIGN', (2, 0), (2, -1), 'CENTER'),
        ('ALIGN', (3, 0), (-1, -1), 'RIGHT'),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8f8f8')]),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#dddddd')),
    ]))
    elems.append(prod_table)

    # ── Totals ──
    elems.append(Spacer(1, 0.2 * cm))
    totals_table = Table([
        ['', '', '', 'Subtotal:', _format_clp(total)],
        ['', '', '', 'Envío:', 'A coordinar'],
        ['', '', '', 'TOTAL:', _format_clp(total)],
    ], colWidths=[6 * cm, 3.5 * cm, 1.5 * cm, 2.5 * cm, 2.5 * cm])
    totals_table.setStyle(TableStyle([
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('ALIGN', (3, 0), (-1, -1), 'RIGHT'),
        ('RIGHTPADDING', (-1, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('FONTNAME', (3, -1), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (3, -1), (-1, -1), 10),
        ('LINEABOVE', (3, -1), (-1, -1), 1, colors.HexColor('#1a1a1a')),
    ]))
    elems.append(totals_table)

    # ── Embroidery notes ──
    if form.get('notas'):
        elems.append(Paragraph('NOTAS DE BORDADO', section_style))
        elems.append(Paragraph(form['notas'], normal_style))

    # ── Payment method ──
    elems.append(Spacer(1, 0.4 * cm))
    elems.append(Paragraph('Método de pago: Transferencia Bancaria', normal_style))

    # ── Footer ──
    elems.append(Spacer(1, 1 * cm))
    elems.append(Paragraph(
        'Este documento es una confirmación de tu pedido. El equipo Maisi se pondrá en contacto '
        'contigo por WhatsApp para coordinar el diseño de bordado y los datos de transferencia.',
        footer_style,
    ))

    doc.build(elems)
    buffer.seek(0)
    return buffer.getvalue()


@api_view(['POST'])
@permission_classes([AllowAny])
def submit_order(request):
    data = request.data
    form = data.get('form', {})
    items = data.get('items', [])
    total = data.get('total', 0)

    # Basic validation
    required_fields = ['nombre', 'rut', 'telefono', 'email', 'direccion', 'ciudad', 'region']
    for field in required_fields:
        if not str(form.get(field, '')).strip():
            return Response({'error': f'Campo requerido: {field}'}, status=status.HTTP_400_BAD_REQUEST)

    if not items:
        return Response({'error': 'El pedido no tiene productos.'}, status=status.HTTP_400_BAD_REQUEST)

    order_number = _next_order_number(form.get('nombre', ''), form.get('email', ''), total)

    # Generate PDF
    try:
        pdf_bytes = _generate_pdf(order_number, form, items, total)
    except Exception as exc:
        return Response({'error': f'Error al generar el PDF: {exc}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Send confirmation email to client
    try:
        notification_email = getattr(settings, 'ORDER_NOTIFICATION_EMAIL', 'contacto@maisibordados.com').strip()

        msg = EmailMessage(
            subject=f'Confirmación de pedido Maisi – {order_number}',
            body=(
                f"Hola {form['nombre']},\n\n"
                f"¡Gracias por tu pedido en Maisi!\n\n"
                f"Recibimos tu orden N° {order_number}. "
                f"El equipo Maisi se pondrá en contacto contigo por WhatsApp al {form['telefono']} para:\n"
                f"  • Coordinar los detalles del diseño de bordado\n"
                f"  • Enviarte los datos de transferencia\n"
                f"  • Confirmar tu pedido\n\n"
                f"Encontrarás el detalle completo de tu pedido en el PDF adjunto.\n\n"
                f"Si tienes dudas escríbenos a contacto@maisi.cl\n\n"
                f"¡Gracias por elegirnos!\n"
                f"El equipo Maisi"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[form['email']],
        )
        msg.attach(f'pedido_{order_number}.pdf', pdf_bytes, 'application/pdf')
        msg.send(fail_silently=True)

        # Send internal notification email with order details
        if notification_email:
            admin_msg = EmailMessage(
                subject=f'Nuevo pedido web {order_number}',
                body=(
                    f"Se recibió un nuevo pedido en la web.\n\n"
                    f"N° de Orden: {order_number}\n"
                    f"Cliente: {form.get('nombre', '')}\n"
                    f"Email: {form.get('email', '')}\n"
                    f"Teléfono: {form.get('telefono', '')}\n"
                    f"RUT: {form.get('rut', '')}\n"
                    f"Total: {_format_clp(total)}\n"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[notification_email],
                reply_to=[form.get('email', '')] if form.get('email') else None,
            )
            admin_msg.attach(f'pedido_{order_number}.pdf', pdf_bytes, 'application/pdf')
            admin_msg.send(fail_silently=True)
    except Exception:
        pass  # Email failure should not block the response

    return Response({
        'success': True,
        'order_number': order_number,
        'pdf_base64': base64.b64encode(pdf_bytes).decode('utf-8'),
    })
