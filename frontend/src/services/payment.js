import api from './api'

/**
 * Servicios relacionados con pagos Flow
 */

export const createFlowPayment = (orderData) => {
  return api.post('/payments/flow/create/', orderData)
}

export const confirmFlowPayment = (flowToken) => {
  return api.post('/payments/flow/confirm/', { token: flowToken })
}

export const getPaymentStatus = (flowToken) => {
  return api.get(`/payments/flow/status/${flowToken}/`)
}
