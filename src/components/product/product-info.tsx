'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Minus, Plus, ShoppingCart, Check, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { localizedName, calculateRentalTotal } from '@/lib/products'
import type { ProductWithImages } from '@/lib/products'
import { useCart } from '@/components/providers/cart-provider'

interface ProductInfoProps {
  product: ProductWithImages
}

type AvailabilityState = 'idle' | 'checking' | 'available' | 'unavailable' | 'error'

export function ProductInfo({ product }: ProductInfoProps) {
  const t = useTranslations()
  const locale = useLocale()
  const { addItem } = useCart()

  const isOutOfStock = product.stock === 0
  const today = new Date().toISOString().split('T')[0]

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [availability, setAvailability] = useState<AvailabilityState>('idle')
  const [added, setAdded] = useState(false)

  const productName = localizedName(product.nameAr, product.nameEn, locale)
  const categoryName = localizedName(product.category.nameAr, product.category.nameEn, locale)
  const description = localizedName(product.descriptionAr, product.descriptionEn, locale)

  // Calculate pricing
  const priceCalc = (() => {
    if (!startDate || !endDate) return null
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) return null
    return calculateRentalTotal(
      product.rentalPricePerDay,
      product.securityDeposit,
      start,
      end,
      quantity
    )
  })()

  // Check availability when both dates are set
  const checkAvailability = useCallback(async () => {
    if (!startDate || !endDate) {
      setAvailability('idle')
      return
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      setAvailability('idle')
      return
    }

    setAvailability('checking')

    try {
      const params = new URLSearchParams({
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      })
      const res = await fetch(`/api/products/${product.id}/availability?${params}`)
      if (!res.ok) {
        setAvailability('error')
        return
      }
      const data = await res.json() as { available: boolean }
      setAvailability(data.available ? 'available' : 'unavailable')
    } catch {
      setAvailability('error')
    }
  }, [startDate, endDate, product.id])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (startDate && endDate) {
        checkAvailability()
      } else {
        setAvailability('idle')
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [startDate, endDate, checkAvailability])

  const canAddToCart =
    !isOutOfStock &&
    priceCalc !== null &&
    (availability === 'available')

  const handleAddToCart = () => {
    if (!canAddToCart || !priceCalc) return

    const firstImage = product.images[0] ?? ''

    addItem({
      productId: product.id,
      slug: product.slug,
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      image: firstImage,
      rentalPricePerDay: product.rentalPricePerDay,
      securityDeposit: product.securityDeposit,
      startDate,
      endDate,
      quantity,
      days: priceCalc.days,
      total: priceCalc.total,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const maxQty = Math.max(1, product.stock)

  return (
    <div className="space-y-5">
      {/* Category + Name */}
      <div>
        <Badge variant="outline" className="mb-3 border-brand/40 text-brand bg-brand/5">
          {categoryName}
        </Badge>
        <h1 className="text-3xl font-bold text-foreground mb-2">{productName}</h1>
        {isOutOfStock && (
          <Badge className="bg-muted text-muted-foreground border-0">
            {t('product.outOfStock')}
          </Badge>
        )}
      </div>

      {/* Price */}
      <div className="space-y-1">
        <p className="text-3xl font-bold text-lut">
          {product.rentalPricePerDay} {t('product.perDay')}
        </p>
        <p className="text-sm text-muted-foreground">
          {t('product.securityDeposit', { amount: product.securityDeposit })}
        </p>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-2">
          {t('product.description')}
        </h2>
        <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
          {description}
        </p>
      </div>

      {/* Rental Period Selector */}
      <div className="space-y-3 pt-4 border-t border-border">
        <h2 className="text-sm font-semibold text-foreground">
          {t('product.rental.title')}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="startDate" className="block text-xs text-muted-foreground mb-1">
              {t('product.rental.startDate')}
            </label>
            <input
              id="startDate"
              type="date"
              min={today}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={isOutOfStock}
              className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-lut disabled:opacity-50"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-xs text-muted-foreground mb-1">
              {t('product.rental.endDate')}
            </label>
            <input
              id="endDate"
              type="date"
              min={startDate || today}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={isOutOfStock || !startDate}
              className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-lut disabled:opacity-50"
            />
          </div>
        </div>

        {/* Availability status */}
        {availability === 'checking' && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            {t('product.rental.checking')}
          </div>
        )}
        {availability === 'available' && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="w-4 h-4" />
            {t('product.rental.available')}
          </div>
        )}
        {availability === 'unavailable' && (
          <div className="flex items-center gap-2 text-sm text-lut">
            <AlertCircle className="w-4 h-4" />
            {t('product.rental.unavailable')}
          </div>
        )}
        {availability === 'error' && (
          <p className="flex items-center gap-2 text-sm text-lut" role="alert">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{t('product.rental.checkError')}</span>
          </p>
        )}
        {availability === 'idle' && startDate && endDate && (
          <p className="text-sm text-muted-foreground">
            {t('product.rental.checking')}
          </p>
        )}
        {availability === 'idle' && (!startDate || !endDate) && (
          <p className="text-sm text-muted-foreground">
            {t('product.rental.selectDates')}
          </p>
        )}
      </div>

      {/* Quantity Selector */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">
          {t('product.quantity.label')}
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={isOutOfStock || quantity <= 1}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg border border-border bg-card hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label={t('product.quantity.decrease')}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-semibold text-foreground">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
            disabled={isOutOfStock || quantity >= maxQty}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg border border-border bg-card hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label={t('product.quantity.increase')}
          >
            <Plus className="w-4 h-4" />
          </button>
          <span className="text-xs text-muted-foreground ms-2">
            {t('product.quantity.label')}: {product.stock}
          </span>
        </div>
      </div>

      {/* Price Summary */}
      {priceCalc && (
        <div className="p-4 rounded-xl bg-bg-light border border-border space-y-2">
          <h3 className="text-sm font-semibold text-foreground mb-2">
            {t('product.priceSummary.title')}
          </h3>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{t('product.priceSummary.days', { count: priceCalc.days })}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              {t('product.priceSummary.rental', {
                rate: product.rentalPricePerDay,
                days: priceCalc.days,
                qty: quantity,
                amount: priceCalc.subtotal,
              })}
            </span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              {t('product.priceSummary.deposit', { amount: priceCalc.deposit })}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold text-lut pt-2 border-t border-border">
            <span>{t('product.priceSummary.total', { amount: priceCalc.total })}</span>
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <div className="space-y-2">
        <Button
          onClick={handleAddToCart}
          disabled={!canAddToCart}
          className="w-full bg-lut hover:bg-lut/90 text-white py-3 text-base font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {added ? (
            <>
              <Check className="w-5 h-5 me-2" />
              {t('product.addedToCart')}
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5 me-2" />
              {t('product.addToCart')}
            </>
          )}
        </Button>
        {added && (
          <Link
            href="/cart"
            className="block text-center text-sm text-lut hover:underline"
          >
            {t('product.viewCart')}
          </Link>
        )}
      </div>
    </div>
  )
}
