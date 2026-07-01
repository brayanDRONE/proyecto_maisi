import { create } from 'zustand'

/**
 * Store de filtros del catálogo
 * Gestiona los filtros activos
 */
export const useFilterStore = create((set) => ({
  filters: {
    category: null,
    line: null,
    minPrice: 0,
    maxPrice: 500000,
    sizes: [],
    search: '',
    ordering: '-created_at',
  },

  // Actualizar filtro
  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }))
  },

  // Actualizar múltiples filtros
  setFilters: (newFilters) => {
    set({ filters: newFilters })
  },

  // Limpiar filtros
  clearFilters: () => {
    set({
      filters: {
        category: null,
        line: null,
        minPrice: 0,
        maxPrice: 500000,
        sizes: [],
        search: '',
        ordering: '-created_at',
      },
    })
  },
}))
