import { useAuthStore } from '../store/authStore'

/**
 * Hook para gestionar autenticación
 */
export const useAuth = () => {
  const authStore = useAuthStore()

  return {
    user: authStore.user,
    token: authStore.token,
    isAuthenticated: !!authStore.token,
    login: authStore.login,
    logout: authStore.logout,
    setUser: authStore.setUser,
  }
}
