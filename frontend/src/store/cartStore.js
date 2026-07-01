import { create } from 'zustand'

/**
 * Store del carrito
 * Estado global para gestionar los items del carrito
 */
export const useCartStore = create((set, get) => ({
  items: [],
  
  // Agregar item al carrito
  addItem: (product, variant, quantity, embroidery = false, embroideryText = '') => {
    const { items } = get()
    const existingItem = items.find(
      (item) =>
        item.product.id === product.id &&
        item.variant?.id === variant?.id &&
        item.embroideryText === embroideryText
    )

    if (existingItem) {
      set({
        items: items.map((item) =>
          item === existingItem
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ),
      })
    } else {
      set({
        items: [...items, { product, variant, quantity, embroidery, embroideryText }],
      })
    }
  },

  // Remover item del carrito
  removeItem: (productId, variantId, embroideryText) => {
    const { items } = get()
    set({
      items: items.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.variant?.id === variantId &&
            item.embroideryText === embroideryText
          )
      ),
    })
  },

  // Actualizar cantidad
  updateQuantity: (productId, variantId, embroideryText, quantity) => {
    const { items } = get()
    set({
      items: items.map((item) =>
        item.product.id === productId &&
        item.variant?.id === variantId &&
        item.embroideryText === embroideryText
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      ),
    })
  },

  // Limpiar carrito
  clearCart: () => set({ items: [] }),

  // Obtener total
  getTotal: () => {
    const { items } = get()
    return items.reduce((total, item) => {
      return total + item.product.price * item.quantity
    }, 0)
  },
}))
