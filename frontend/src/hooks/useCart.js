import { useCartStore } from '../store/cartStore'

/**
 * Hook para gestionar el carrito
 */
export const useCart = () => {
  const cartStore = useCartStore()

  return {
    items: cartStore.items,
    addItem: cartStore.addItem,
    removeItem: cartStore.removeItem,
    updateQuantity: cartStore.updateQuantity,
    clearCart: cartStore.clearCart,
    total: cartStore.getTotal(),
    itemCount: cartStore.items.length,
  }
}
