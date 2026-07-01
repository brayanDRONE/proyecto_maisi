import { useQuery } from '@tanstack/react-query'
import { getProducts, getProductBySlug, getCategories } from '../services/products'

/**
 * Hook para obtener productos
 */
export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
    select: (data) => data.data,
  })
}

/**
 * Hook para obtener un producto por slug
 */
export const useProduct = (slug) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug),
    select: (data) => data.data,
    enabled: !!slug,
  })
}

/**
 * Hook para obtener categorías
 */
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
    select: (data) => data.data,
  })
}
