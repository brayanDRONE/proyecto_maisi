import { useCartStore } from '../store/cartStore'

/**
 * Hook para gestionar el carrito
 * addToCart acepta el objeto fusionado que construye ProductDetail:
 *   { ...product, selectedSize, selectedColor, quantity, price }
 */
export const useCart = () => {
  const cartStore = useCartStore()

  const addToCart = ({ selectedSize, selectedColor, quantity = 1, price, ...product }) => {
    const productWithPrice = { ...product, price: price ?? product.price }
    const variant = selectedSize
      ? {
          id: `${product.id}_${selectedSize}_${selectedColor || ''}`,
          size: selectedSize,
          color: selectedColor || '',
        }
      : null
    cartStore.addItem(productWithPrice, variant, quantity)
  }

  return {
    items: cartStore.items,
    addToCart,
    addItem: cartStore.addItem,
    removeItem: cartStore.removeItem,
    updateQuantity: cartStore.updateQuantity,
    clearCart: cartStore.clearCart,
    total: cartStore.getTotal(),
    itemCount: cartStore.items.reduce((acc, item) => acc + item.quantity, 0),
  }
}
