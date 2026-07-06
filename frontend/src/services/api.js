import axios from 'axios'
import { useAuthStore } from '../store/authStore'

// URL base de la API
const envApiBaseUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/$/, '')
const DEFAULT_PROD_API_URL = 'https://tworld-backend.onrender.com'
const API_BASE_URL = envApiBaseUrl || (import.meta.env.DEV ? 'http://localhost:8000' : DEFAULT_PROD_API_URL)

if (!envApiBaseUrl && !import.meta.env.DEV) {
  console.warn(`VITE_API_URL no esta configurada en produccion. Usando fallback ${DEFAULT_PROD_API_URL}.`)
}

const API_PREFIX = `${API_BASE_URL}/api`

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
