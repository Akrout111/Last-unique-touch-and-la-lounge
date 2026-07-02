export interface CartItem {
  productId: string
  slug: string
  nameAr: string
  nameEn: string
  image: string
  rentalPricePerDay: number
  securityDeposit: number
  startDate: string
  endDate: string
  quantity: number
  days: number
  total: number
}

export const CART_KEY = 'lut_cart'

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) as CartItem[] : []
  } catch {
    return []
  }
}

export function addToCart(item: CartItem): void {
  if (typeof window === 'undefined') return
  const cart = getCart()
  const existing = cart.findIndex(
    (c) =>
      c.productId === item.productId &&
      c.startDate === item.startDate &&
      c.endDate === item.endDate
  )
  if (existing >= 0) {
    cart[existing].quantity += item.quantity
    cart[existing].total =
      cart[existing].rentalPricePerDay * cart[existing].days * cart[existing].quantity +
      cart[existing].securityDeposit * cart[existing].quantity
  } else {
    cart.push(item)
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  window.dispatchEvent(new Event('cart-updated'))
}

export function removeFromCart(index: number): void {
  if (typeof window === 'undefined') return
  const cart = getCart()
  cart.splice(index, 1)
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  window.dispatchEvent(new Event('cart-updated'))
}

export function clearCart(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(CART_KEY)
  window.dispatchEvent(new Event('cart-updated'))
}

export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.quantity, 0)
}

export function getCartTotal(): number {
  return getCart().reduce((sum, item) => sum + item.total, 0)
}
