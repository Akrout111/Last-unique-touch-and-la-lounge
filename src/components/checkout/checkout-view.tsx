'use client'

import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations, useLocale } from 'next-intl'
import { Link, useRouter } from '@/i18n/routing'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import { useCart } from '@/components/providers/cart-provider'
import { localizedName } from '@/lib/products'

const checkoutSchema = z.object({
  customerName: z.string().min(3).max(100),
  customerPhone: z.string().regex(/^\+?[0-9\s-]{8,20}$/),
  customerEmail: z.string().email(),
  address: z.string().min(10).max(500),
  city: z.string().min(2).max(50),
  notes: z.string().max(1000).optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export function CheckoutView() {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const { items, hydrated, total, rentalTotal, depositTotal } = useCart()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)

  // Generate idempotency key once on mount
  const idempotencyKey = useMemo(
    () => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    []
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  })

  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight

  // Hydration guard
  if (!hydrated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">...</div>
      </div>
    )
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="font-display text-2xl font-bold text-foreground mb-4">
          {t('checkout.empty')}
        </h1>
        <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/products">
            {t('cart.empty.cta')}
            <ArrowIcon className="w-4 h-4 ms-2" />
          </Link>
        </Button>
      </div>
    )
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customer: data,
          idempotencyKey,
        }),
      })

      // V11 Fix #8: Defensive JSON parse — a 5xx from a misconfigured proxy
      // or an empty body would otherwise throw here and mask the real error
      // behind a generic "internal error" message.
      const result = (await response.json().catch(() => ({}))) as { error?: string; orderId?: string }

      if (!response.ok) {
        // V11 Fix #8: Complete error code map covering every error code the
        // /api/orders route can return. Unknown codes fall through to the
        // generic internal-error message.
        const errorKey =
          result.error === 'price_mismatch' ? 'checkout.errors.priceMismatch'
          : result.error === 'insufficient_stock' || result.error === 'out_of_stock' ? 'checkout.errors.insufficientStock'
          : result.error === 'not_available' ? 'checkout.errors.notAvailable'
          : result.error === 'duplicate_request' ? 'checkout.errors.duplicateRequest'
          : result.error === 'invalid_input' ? 'checkout.errors.invalidInput'
          : result.error === 'invalid_products' ? 'checkout.errors.invalidProducts'
          : result.error === 'invalid_dates' ? 'checkout.errors.invalidDates'
          : result.error === 'days_mismatch' ? 'checkout.errors.daysMismatch'
          : result.error === 'total_mismatch' ? 'checkout.errors.totalMismatch'
          : result.error === 'rate_limited' ? 'checkout.errors.rateLimited'
          : result.error === 'invalid_json' ? 'checkout.errors.invalidInput'
          : 'checkout.errors.internalError'
        setErrorMessage(t(errorKey))
        setSubmitting(false)
        return
      }

      // Success — redirect to payment page (cart cleared after payment).
      // V11 Fix #8: null-guard orderId. If the API returns 200 but with a
      // missing/empty orderId (malformed response), surface the generic
      // internal-error message instead of navigating to `/checkout/payment?order=undefined`.
      if (!result?.orderId) {
        setErrorMessage(t('checkout.errors.internalError'))
        setSubmitting(false)
        return
      }
      router.push(`/checkout/payment?order=${result.orderId}`)
    } catch {
      setErrorMessage(t('checkout.errors.internalError'))
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-px w-6 bg-accent/50" aria-hidden="true" />
          <span className="eyebrow text-accent text-[0.625rem]">
            {t('checkout.title')}
          </span>
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">
          {t('checkout.title')}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 p-6 rounded-md bg-card border border-border shadow-luxury"
          >
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-accent/50" aria-hidden="true" />
              <span className="eyebrow text-accent text-[0.625rem]">
                {t('checkout.form.customerInfo')}
              </span>
            </div>
            <h2 className="font-display text-lg font-bold text-foreground">
              {t('checkout.form.customerInfo')}
            </h2>

              {errorMessage && (
                <div className="flex items-start gap-2 p-3 rounded-md bg-primary/10 border border-primary/30 text-primary text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="customerName">
                  {t('checkout.form.name')}
                </Label>
                <Input
                  id="customerName"
                  autoComplete="name"
                  {...register('customerName')}
                  className="bg-background luxury-input"
                />
                {errors.customerName && (
                  <p className="flex items-center gap-1.5 text-xs text-primary mt-1" role="alert">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {errors.customerName?.type === 'required'
                        ? t('checkout.form.errors.nameRequired')
                        : t('checkout.form.errors.nameMinLength')}
                    </span>
                  </p>
                )}
              </div>

              {/* Phone + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="customerPhone">
                    {t('checkout.form.phone')}
                  </Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    dir="ltr"
                    autoComplete="tel"
                    {...register('customerPhone')}
                    className="bg-background luxury-input"
                  />
                  {errors.customerPhone && (
                    <p className="flex items-center gap-1.5 text-xs text-primary mt-1" role="alert">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {errors.customerPhone?.type === 'required'
                          ? t('checkout.form.errors.phoneRequired')
                          : t('checkout.form.errors.phoneInvalid')}
                      </span>
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="customerEmail">
                    {t('checkout.form.email')}
                  </Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    dir="ltr"
                    autoComplete="email"
                    {...register('customerEmail')}
                    className="bg-background luxury-input"
                  />
                  {errors.customerEmail && (
                    <p className="flex items-center gap-1.5 text-xs text-primary mt-1" role="alert">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {errors.customerEmail?.type === 'required'
                          ? t('checkout.form.errors.emailRequired')
                          : t('checkout.form.errors.emailInvalid')}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <Label htmlFor="address">
                  {t('checkout.form.address')}
                </Label>
                <Textarea
                  id="address"
                  rows={2}
                  autoComplete="street-address"
                  {...register('address')}
                  className="bg-background luxury-input"
                />
                {errors.address && (
                  <p className="flex items-center gap-1.5 text-xs text-primary mt-1" role="alert">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {errors.address?.type === 'required'
                        ? t('checkout.form.errors.addressRequired')
                        : t('checkout.form.errors.addressMinLength')}
                    </span>
                  </p>
                )}
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <Label htmlFor="city">
                  {t('checkout.form.city')}
                </Label>
                <Input
                  id="city"
                  autoComplete="address-level2"
                  {...register('city')}
                  className="bg-background luxury-input"
                />
                {errors.city && (
                  <p className="flex items-center gap-1.5 text-xs text-primary mt-1" role="alert">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{t('checkout.form.errors.cityRequired')}</span>
                  </p>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <Label htmlFor="notes">
                  {t('checkout.form.notes')}
                </Label>
                <Textarea
                  id="notes"
                  rows={3}
                  {...register('notes')}
                  className="bg-background luxury-input"
                />
              </div>

              {/* Terms acceptance */}
              <div className="flex items-start gap-3 mb-4">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="mt-1 size-5"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <label htmlFor="terms" className="text-sm">
                  {t('checkout.form.agreePrefix')}
                  <Link href="/terms" target="_blank" className="text-primary underline">
                    {t('checkout.form.termsLink')}
                  </Link>
                </label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={submitting || !termsAccepted}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 me-2 animate-spin" />
                    {t('checkout.form.submitting')}
                  </>
                ) : (
                  t('checkout.form.submit')
                )}
              </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 rounded-md glass-card shadow-luxury">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-px w-6 bg-accent/50" aria-hidden="true" />
              <span className="eyebrow text-accent text-[0.625rem]">
                {t('checkout.summary.title')}
              </span>
            </div>
            <h2 className="font-display text-lg font-bold text-foreground mb-4">
              {t('checkout.summary.title')}
            </h2>

            {/* Items */}
            <div className="space-y-3 mb-4 pb-4 border-b border-border max-h-64 overflow-y-auto">
              {items.map((item, index) => {
                const productName = localizedName(item.nameAr, item.nameEn, locale)
                return (
                  <div key={index} className="flex gap-3">
                    <div className="relative w-14 h-14 shrink-0 rounded-md overflow-hidden bg-muted">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={productName}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <div className="w-full h-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-1">
                        {productName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t('cart.item.period', {
                          start: item.startDate.split('T')[0],
                          end: item.endDate.split('T')[0],
                          days: item.days,
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        × {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-foreground shrink-0">
                      {item.total.toFixed(3)}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Totals */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t('cart.summary.rental')}
                </span>
                <span className="font-medium">
                  {rentalTotal.toFixed(3)} {t('common.currency')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t('cart.summary.deposit')}
                </span>
                <span className="font-medium">
                  {depositTotal.toFixed(3)} {t('common.currency')}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center py-3 border-t border-border">
              <span className="font-bold text-foreground">
                {t('checkout.summary.total')}
              </span>
              <span className="font-display text-xl font-bold text-primary">
                {total.toFixed(3)} {t('common.currency')}
              </span>
            </div>

            <p className="text-xs text-muted-foreground mt-3 text-center">
              {t('checkout.summary.availabilityNote')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
