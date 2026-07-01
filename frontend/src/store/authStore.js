import { create } from 'zustand'

/**
 * Store de autenticación
 * Gestiona el estado del usuario y sesión
 */
export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('access_token') || null,
  
  // Login
  login: (user, token) => {
    localStorage.setItem('access_token', token)
    set({ user, token })
  },

  // Logout
  logout: () => {
    localStorage.removeItem('access_token')
    set({ user: null, token: null })
  },

  // Actualizar usuario
  setUser: (user) => set({ user }),
}))
