'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations, useLocale } from 'next-intl'
import { Link, useRouter } from '@/i18n/routing'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, AlertCircle, Lock, ShieldCheck, CreditCard, ArrowLeft, ArrowRight } from 'lucide-react'
import { useCart } from '@/components/providers/cart-provider'
import { localizedName } from '@/lib/products'

const paymentSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, 'invalid_card'),
  cardName: z.string().min(3).max(100),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'invalid_expiry'),
  cvv: z.string().regex(/^\d{3,4}$/, 'invalid_cvv'),
  saveCard: z.boolean().optional(),
})

type PaymentFormData = z.infer<typeof paymentSchema>

interface PaymentViewProps {
  orderId?: string
}

export function PaymentView({ orderId }: PaymentViewProps) {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const { items, hydrated, total, clear } = useCart()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: '',
      cardName: '',
      expiry: '',
      cvv: '',
      saveCard: false,
    },
  })

  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight

  // Card number mask: auto-insert spaces every 4 digits
  const formatCardNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
  }

  // Expiry mask: MM/YY
  const formatExpiry = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`
    }
    return digits
  }

  // CVV: digits only, max 4
  const formatCvv = (value: string): string => {
    return value.replace(/\D/g, '').slice(0, 4)
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('cardNumber', formatCardNumber(e.target.value), { shouldValidate: false })
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('expiry', formatExpiry(e.target.value), { shouldValidate: false })
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('cvv', formatCvv(e.target.value), { shouldValidate: false })
  }

  // No order ID — can't proceed
  if (!orderId) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          {t('payment.errors.order_not_found')}
        </h1>
        <Button asChild className="bg-lut hover:bg-lut/90 text-white">
          <Link href="/products">
            {t('cart.empty.cta')}
            <ArrowIcon className="w-4 h-4 ms-2" />
          </Link>
        </Button>
      </div>
    )
  }

  const onSubmit = async (_data: PaymentFormData) => {
    setSubmitting(true)
    setErrorMessage(null)

    // Simulate payment processing (2 seconds) — NO real payment API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Call internal mock to confirm payment
    try {
      const response = await fetch('/api/webhooks/payment-success', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })

      const result = await response.json()

      if (!response.ok) {
        const errorCode = result.error as string | undefined
        const errorKey = `payment.errors.${errorCode ?? 'payment_failed'}`
        try {
          setErrorMessage(t(errorKey))
        } catch {
          setErrorMessage(t('payment.errors.payment_failed'))
        }
        setSubmitting(false)
        return
      }

      // Success — clear cart and redirect to success page
      clear()
      router.push(`/checkout/success?order=${orderId}`)
    } catch {
      setErrorMessage(t('payment.errors.payment_failed'))
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pt-24">
      <h1 className="text-3xl font-bold text-foreground mb-8">
        {t('payment.title')}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          {/* Order info card */}
          <div className="p-4 rounded-xl bg-bg-light border border-border mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">
                  {t('payment.orderId', { id: orderId.slice(-8) })}
                </p>
                <p className="text-xl font-bold text-lut mt-1">
                  {t('payment.total', { amount: total.toFixed(3) })}
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-gold" />
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {t('payment.displayNote')}
            </p>
          </div>

          {/* Card form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 p-6 rounded-xl bg-card border border-border"
          >
            {errorMessage && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-lut/10 border border-lut/30 text-lut text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Card Number */}
            <div className="space-y-1.5">
              <Label htmlFor="cardNumber">
                {t('payment.form.cardNumber')}
              </Label>
              <Input
                id="cardNumber"
                dir="ltr"
                autoComplete="cc-number"
                inputMode="numeric"
                placeholder="0000 0000 0000 0000"
                {...register('cardNumber')}
                onChange={handleCardNumberChange}
                className="bg-background"
              />
              {errors.cardNumber && (
                <p className="text-xs text-lut">{t('payment.errors.invalid_card')}</p>
              )}
            </div>

            {/* Card Name */}
            <div className="space-y-1.5">
              <Label htmlFor="cardName">
                {t('payment.form.cardName')}
              </Label>
              <Input
                id="cardName"
                autoComplete="cc-name"
                {...register('cardName')}
                className="bg-background"
              />
              {errors.cardName && (
                <p className="flex items-center gap-1.5 text-xs text-lut mt-1" role="alert">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {errors.cardName?.type === 'required'
                      ? t('payment.errors.nameRequired')
                      : t('payment.errors.nameMinLength')}
                  </span>
                </p>
              )}
            </div>

            {/* Expiry + CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="expiry">
                  {t('payment.form.expiry')}
                </Label>
                <Input
                  id="expiry"
                  dir="ltr"
                  autoComplete="cc-exp"
                  inputMode="numeric"
                  placeholder="MM/YY"
                  {...register('expiry')}
                  onChange={handleExpiryChange}
                  className="bg-background"
                />
                {errors.expiry && (
                  <p className="text-xs text-lut">{t('payment.errors.invalid_expiry')}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cvv">
                  {t('payment.form.cvv')}
                </Label>
                <Input
                  id="cvv"
                  type="password"
                  dir="ltr"
                  autoComplete="cc-csc"
                  inputMode="numeric"
                  placeholder="•••"
                  {...register('cvv')}
                  onChange={handleCvvChange}
                  className="bg-background"
                />
                {errors.cvv && (
                  <p className="text-xs text-lut">{t('payment.errors.invalid_cvv')}</p>
                )}
              </div>
            </div>

            {/* Save card (UI only) */}
            <div className="flex items-center gap-2">
              <Controller
                control={control}
                name="saveCard"
                render={({ field: { value, onChange } }) => (
                  <Checkbox
                    id="saveCard"
                    checked={value ?? false}
                    onCheckedChange={(c) => onChange(!!c)}
                  />
                )}
              />
              <Label htmlFor="saveCard" className="text-sm text-muted-foreground cursor-pointer">
                {t('payment.form.saveCard')}
              </Label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-lut hover:bg-lut/90 text-white py-3 text-base font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 me-2 animate-spin" />
                  {t('payment.form.processing')}
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 me-2" />
                  {t('payment.form.submit', { amount: total.toFixed(3) })}
                </>
              )}
            </Button>
          </form>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border">
              <Lock className="w-4 h-4 text-gold shrink-0" />
              <span className="text-xs text-foreground">
                {t('payment.trust.ssl')}
              </span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border">
              <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
              <span className="text-xs text-foreground">
                {t('payment.trust.fraud')}
              </span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border">
              <CreditCard className="w-4 h-4 text-gold shrink-0" />
              <span className="text-xs text-foreground">
                {t('payment.trust.cards')}
              </span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 rounded-xl bg-bg-light border border-border">
            <h2 className="text-lg font-bold text-foreground mb-4">
              {t('payment.orderSummary')}
            </h2>

            {/* Items */}
            {hydrated && items.length > 0 ? (
              <div className="space-y-3 mb-4 pb-4 border-b border-border max-h-64 overflow-y-auto">
                {items.map((item, index) => {
                  const productName = localizedName(item.nameAr, item.nameEn, locale)
                  return (
                    <div key={index} className="flex gap-3">
                      <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-muted">
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
            ) : (
              <p className="text-xs text-muted-foreground mb-4">
                {t('payment.emptyCart')}
              </p>
            )}

            {/* Total */}
            <div className="flex justify-between items-center py-3 border-t border-border">
              <span className="font-bold text-foreground">
                {t('checkout.summary.total')}
              </span>
              <span className="text-xl font-bold text-lut">
                {t('payment.total', { amount: total.toFixed(3) })}
              </span>
            </div>

            <Button asChild variant="outline" className="w-full mt-4 border-border">
              <Link href="/cart">
                <ArrowIcon className="w-4 h-4 me-2" />
                {t('payment.backToCart')}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
