'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DayPicker, type DateRange } from 'react-day-picker'
import { Minus, Plus, ShoppingCart, Check, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { localizedName, calculateRentalTotal } from '@/lib/products'
import type { ProductWithImages } from '@/lib/products'
import { useCart } from '@/components/providers/cart-provider'

import 'react-day-picker/src/style.css'

interface ProductInfoProps {
  product: ProductWithImages
}

type AvailabilityState = 'idle' | 'checking' | 'available' | 'unavailable' | 'error'

export function ProductInfo({ product }: ProductInfoProps) {
  const t = useTranslations()
  const locale = useLocale()
  const { addItem } = useCart()

  const isOutOfStock = product.stock === 0

  const [range, setRange] = useState<DateRange | undefined>(undefined)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [availability, setAvailability] = useState<AvailabilityState>('idle')
  const [added, setAdded] = useState(false)

  // Holds the "added to cart" reset timeout so we can clear it on unmount
  // (prevents setState-after-unmount warning if the user navigates away
  // within the 2s window).
  const addedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (addedTimeoutRef.current) clearTimeout(addedTimeoutRef.current)
    }
  }, [])

  const productName = localizedName(product.nameAr, product.nameEn, locale)
  const categoryName = localizedName(product.category.nameAr, product.category.nameEn, locale)
  const description = localizedName(product.descriptionAr, product.descriptionEn, locale)

  // Calculate pricing — only when both range endpoints are present.
  const priceCalc = (() => {
    if (!range?.from || !range?.to) return null
    const start = range.from
    const end = range.to
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
    // Clear any in-flight reset timer (rapid double-clicks) before arming a
    // new one. The unmount effect cleans up the latest timer.
    if (addedTimeoutRef.current) clearTimeout(addedTimeoutRef.current)
    addedTimeoutRef.current = setTimeout(() => setAdded(false), 2000)
  }

  const maxQty = Math.max(1, product.stock)

  return (
    <div className="space-y-5">
      {/* Category + Name */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="h-px w-6 bg-accent/50" aria-hidden="true" />
          <span className="eyebrow text-accent text-[0.625rem]">{categoryName}</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">{productName}</h1>
        {isOutOfStock && (
          <Badge className="bg-muted text-muted-foreground border-0">
            {t('product.outOfStock')}
          </Badge>
        )}
      </div>

      {/* Price */}
      <div className="space-y-1">
        <p className="font-display text-3xl font-bold text-primary">
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

      {/* Rental Period — DayPicker range + sticky price summary */}
      <div className="pt-4 border-t border-border space-y-3">
        <h2 className="text-sm font-semibold text-foreground">
          {t('product.rental.title')}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* DayPicker range selector */}
          <div>
            <DayPicker
              mode="range"
              selected={range}
              onSelect={(r) => {
                setRange(r ?? undefined)
                if (r?.from) setStartDate(r.from.toISOString())
                else setStartDate('')
                if (r?.to) setEndDate(r.to.toISOString())
                else setEndDate('')
              }}
              min={1}
              max={30}
              disabled={[{ before: new Date() }]}
              dir={locale === 'ar' ? 'rtl' : 'ltr'}
              numberOfMonths={1}
              className="rounded-md border border-border/50 p-4 bg-card shadow-luxury"
              style={{
                ['--rdp-accent-color' as string]: 'var(--primary)',
                ['--rdp-accent-background-color' as string]: 'color-mix(in srgb, var(--primary) 15%, transparent)',
              }}
              modifiersClassNames={{
                selected: 'bg-primary text-primary-foreground',
                range_start: 'bg-primary text-primary-foreground',
                range_end: 'bg-primary text-primary-foreground',
                today: 'border-2 border-accent',
              }}
            />

            {/* Availability status */}
            {availability === 'checking' && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('product.rental.checking')}
              </div>
            )}
            {availability === 'available' && (
              <div className="flex items-center gap-2 text-sm text-green-600 mt-3">
                <CheckCircle2 className="w-4 h-4" />
                {t('product.rental.available')}
              </div>
            )}
            {availability === 'unavailable' && (
              <div className="flex items-center gap-2 text-sm text-primary mt-3">
                <AlertCircle className="w-4 h-4" />
                {t('product.rental.unavailable')}
              </div>
            )}
            {availability === 'error' && (
              <p className="flex items-center gap-2 text-sm text-primary mt-3" role="alert">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{t('product.rental.checkError')}</span>
              </p>
            )}
            {availability === 'idle' && startDate && endDate && (
              <p className="text-sm text-muted-foreground mt-3">
                {t('product.rental.checking')}
              </p>
            )}
            {availability === 'idle' && (!startDate || !endDate) && (
              <p className="text-sm text-muted-foreground mt-3">
                {t('product.rental.selectDates')}
              </p>
            )}
          </div>

          {/* Sticky Price Summary card (desktop) */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="glass-card rounded-md p-6 shadow-luxury space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-accent/50" aria-hidden="true" />
                <span className="eyebrow text-accent text-[0.625rem]">
                  {t('product.priceSummary.title')}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t('product.priceSummary.rentalDays')}
                  </span>
                  <span className="font-medium text-foreground">
                    {priceCalc ? priceCalc.days : 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t('product.priceSummary.dailyRate')}
                  </span>
                  <span className="font-medium text-foreground">
                    {product.rentalPricePerDay.toFixed(3)} {t('common.currency')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t('product.priceSummary.securityDeposit')}
                  </span>
                  <span className="font-medium text-foreground">
                    {product.securityDeposit.toFixed(3)} {t('common.currency')}
                  </span>
                </div>
              </div>

              <div className="h-px bg-border" />

              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-foreground">
                  {t('product.priceSummary.total')}
                </span>
                <span className="font-display text-2xl font-bold text-primary">
                  {priceCalc ? priceCalc.total.toFixed(3) : '0.000'} {t('common.currency')}
                </span>
              </div>

              {/* Quantity + Add to cart live inside the summary on desktop */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={isOutOfStock || quantity <= 1}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md border border-border bg-card hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md border border-border bg-card hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label={t('product.quantity.increase')}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-muted-foreground ms-2">
                    {t('product.quantity.label')}: {product.stock}
                  </span>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={!canAddToCart}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="block text-center text-sm text-primary hover:underline"
                  >
                    {t('product.viewCart')}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
