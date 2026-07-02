'use client'

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import {
  type CartItem,
  getCart,
  addToCart as storageAdd,
  removeFromCart as storageRemove,
  clearCart as storageClear,
} from '@/lib/cart'

const CART_KEY = 'lut_cart'

interface CartContextValue {
  items: CartItem[]
  count: number
  total: number
  rentalTotal: number
  depositTotal: number
  addItem: (item: CartItem) => void
  removeItem: (index: number) => void
  updateQuantity: (index: number, quantity: number) => void
  clear: () => void
  hydrated: boolean
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Load from localStorage on mount — required for client-only state hydration
  useEffect(() => {
    const loadCart = () => setItems(getCart())
    loadCart()
    setHydrated(true)

    window.addEventListener('cart-updated', loadCart)
    return () => window.removeEventListener('cart-updated', loadCart)
  }, [])

  const addItem = useCallback((item: CartItem) => {
    storageAdd(item)
    setItems(getCart())
  }, [])

  const removeItem = useCallback((index: number) => {
    storageRemove(index)
    setItems(getCart())
  }, [])

  const updateQuantity = useCallback((index: number, quantity: number) => {
    setItems((prev) => {
      if (index < 0 || index >= prev.length) return prev
      const item = prev[index]
      if (!item) return prev
      const newQty = Math.max(1, quantity)
      const updated: CartItem = {
        ...item,
        quantity: newQty,
        total:
          item.rentalPricePerDay * item.days * newQty +
          item.securityDeposit * newQty,
      }
      const next = [...prev]
      next[index] = updated
      if (typeof window !== 'undefined') {
        localStorage.setItem(CART_KEY, JSON.stringify(next))
        window.dispatchEvent(new Event('cart-updated'))
      }
      return next
    })
  }, [])

  const clear = useCallback(() => {
    storageClear()
    setItems([])
  }, [])

  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])
  const rentalTotal = useMemo(
    () => items.reduce((sum, i) => sum + i.rentalPricePerDay * i.days * i.quantity, 0),
    [items]
  )
  const depositTotal = useMemo(
    () => items.reduce((sum, i) => sum + i.securityDeposit * i.quantity, 0),
    [items]
  )
  const total = useMemo(() => rentalTotal + depositTotal, [rentalTotal, depositTotal])

  const value = useMemo(
    () => ({
      items,
      count,
      total,
      rentalTotal,
      depositTotal,
      addItem,
      removeItem,
      updateQuantity,
      clear,
      hydrated,
    }),
    [items, count, total, rentalTotal, depositTotal, addItem, removeItem, updateQuantity, clear, hydrated]
  )

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
