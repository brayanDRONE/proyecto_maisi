import api from './api'

/**
 * Servicios relacionados con órdenes
 */

/** Envía la orden al backend: genera PDF y envía email al cliente */
export const submitOrder = ({ form, items, total }) =>
  api.post('/orders/submit/', { form, items, total }).then((r) => r.data)

export const createOrder = (orderData) => {
  return api.post('/orders/', orderData)
}

export const getOrder = (orderNumber) => {
  return api.get(`/orders/${orderNumber}/`)
}

export const getMyOrders = () => {
  return api.get('/orders/my-orders/')
}

export const updateOrderStatus = (orderId, status) => {
  return api.patch(`/orders/${orderId}/`, { status })
}
