'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Trash2, Minus, Plus, ShoppingCart, ArrowLeft, ArrowRight } from 'lucide-react'
import { useCart } from '@/components/providers/cart-provider'
import { localizedName } from '@/lib/products'

export function CartView() {
  const t = useTranslations()
  const locale = useLocale()
  const { items, hydrated, removeItem, updateQuantity, rentalTotal, depositTotal, total } = useCart()

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
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <ShoppingCart className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {t('cart.empty.title')}
        </h1>
        <p className="text-muted-foreground mb-8">
          {t('cart.empty.subtitle')}
        </p>
        <Button asChild className="bg-lut hover:bg-lut/90 text-white">
          <Link href="/products">
            {t('cart.empty.cta')}
            <ArrowIcon className="w-4 h-4 ms-2" />
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">
        {t('cart.title')}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => {
            const productName = localizedName(item.nameAr, item.nameEn, locale)
            const startDateFormatted = item.startDate.split('T')[0]
            const endDateFormatted = item.endDate.split('T')[0]

            return (
              <div
                key={`${item.productId}-${item.startDate}-${item.endDate}-${index}`}
                className="flex gap-4 p-4 rounded-xl bg-card border border-border"
              >
                {/* Image */}
                <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-muted">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={productName}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      {t('common.noImage')}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-semibold text-foreground hover:text-lut transition-colors line-clamp-1"
                    >
                      {productName}
                    </Link>
                    <button
                      onClick={() => removeItem(index)}
                      className="text-muted-foreground hover:text-lut transition-colors shrink-0"
                      aria-label={t('cart.item.remove')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1">
                    {t('cart.item.period', {
                      start: startDateFormatted,
                      end: endDateFormatted,
                      days: item.days,
                    })}
                  </p>

                  <p className="text-sm text-lut font-medium mt-1">
                    {item.rentalPricePerDay} {t('cart.item.perDay')}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg border border-border bg-card hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        aria-label={t('product.quantity.decrease')}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg border border-border bg-card hover:bg-secondary transition-colors"
                        aria-label={t('product.quantity.increase')}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Item total */}
                    <p className="font-bold text-foreground">
                      {item.total.toFixed(3)} {t('featured.perDay').split(' ')[0]}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Continue shopping */}
          <div className="pt-4">
            <Button asChild variant="outline" className="border-border">
              <Link href="/products">
                <ArrowIcon className="w-4 h-4 me-2 rotate-180" />
                {t('cart.continueShopping')}
              </Link>
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 rounded-xl bg-bg-light border border-border">
            <h2 className="text-lg font-bold text-foreground mb-4">
              {t('cart.summary.title')}
            </h2>

            <div className="space-y-3 pb-4 border-b border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t('cart.summary.rental')}
                </span>
                <span className="font-medium text-foreground">
                  {rentalTotal.toFixed(3)} KWD
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t('cart.summary.deposit')}
                </span>
                <span className="font-medium text-foreground">
                  {depositTotal.toFixed(3)} KWD
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center py-4">
              <span className="font-bold text-foreground">
                {t('cart.summary.total')}
              </span>
              <span className="text-xl font-bold text-lut">
                {total.toFixed(3)} KWD
              </span>
            </div>

            <Button
              asChild
              className="w-full bg-lut hover:bg-lut/90 text-white py-3 text-base font-semibold rounded-lg"
            >
              <Link href="/checkout">
                {t('cart.checkout')}
                <ArrowIcon className="w-4 h-4 ms-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
