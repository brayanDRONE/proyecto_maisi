import api from './api'

/**
 * Servicios relacionados con productos
 */

export const getProducts = (params = {}) => {
  return api.get('/products/', { params })
}

export const getProductBySlug = (slug) => {
  return api.get(`/products/${slug}/`)
}

export const getCategories = () => {
  return api.get('/products/categories/')
}

export const getLines = () => {
  return api.get('/products/lines/')
}

export const getFeaturedProducts = () => {
  return api.get('/products/', { params: { featured: true } })
}
