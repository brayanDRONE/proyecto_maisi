import axios from 'axios'
import { useAuthStore } from '../store/authStore'

// URL base de la API
const envApiBaseUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/$/, '')
const API_BASE_URL = envApiBaseUrl || (import.meta.env.DEV ? 'http://localhost:8000' : '')

if (!API_BASE_URL && !import.meta.env.DEV) {
  console.warn('VITE_API_URL no esta configurada en produccion. Usando /api como fallback.')
}

const API_PREFIX = API_BASE_URL ? `${API_BASE_URL}/api` : '/api'

/**
 * Instancia de Axios con interceptores
 */
const api = axios.create({
  baseURL: API_PREFIX,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de solicitud: agregar token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor de respuesta: manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
