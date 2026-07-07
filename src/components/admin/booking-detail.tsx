'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowLeft, Check, X, CheckCheck, Loader2 } from 'lucide-react'
import { useToast } from '@/components/providers/toast-provider'
import { updateBookingStatusAction } from '@/app/[locale]/admin/(dashboard)/bookings/actions'
import { localizedName } from '@/lib/products'

interface BookingDetailData {
  id: string
  status: string
  startDate: string
  endDate: string
  totalAmount: number
  currency: string
  createdAt: string
  customerName: string
  customerPhone: string
  customerEmail: string
  product: {
    nameAr: string
    nameEn: string
    slug: string
    rentalPricePerDay: number
    securityDeposit: number
    categoryNameAr: string
    categoryNameEn: string
  } | null
}

interface BookingDetailProps {
  booking: BookingDetailData
  locale: string
}

export function BookingDetail({ booking, locale }: BookingDetailProps) {
  const t = useTranslations()
  const { showToast } = useToast()
  const router = useRouter()
  const [updating, setUpdating] = useState(false)
  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight

  const days = Math.max(
    1,
    Math.ceil(
      (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (24 * 60 * 60 * 1000)
    )
  )

  const rentalAmount = booking.product ? booking.product.rentalPricePerDay * days : booking.totalAmount
  const depositAmount = booking.product ? booking.product.securityDeposit : 0

  const handleStatusChange = async (newStatus: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') => {
    setUpdating(true)
    const result = await updateBookingStatusAction(booking.id, newStatus)
    setUpdating(false)

    if (result.success) {
      showToast('success', t('admin.bookings.statusChanged'))
      router.refresh()
    } else {
      const errorKey = result.error === 'invalid_transition'
        ? 'admin.bookings.invalidTransition'
        : 'admin.errors.internal_error'
      showToast('error', t(errorKey))
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back link */}
      <Link
        href="/admin/bookings"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-lut transition-colors"
      >
        <ArrowIcon className="w-4 h-4 rotate-180" />
        {t('admin.bookings.title')}
      </Link>

      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('admin.bookings.detail.title')}</h1>
          <p className="text-sm text-muted-foreground mt-1 font-mono" dir="ltr">#{booking.id}</p>
        </div>
        <span className={`px-3 py-1.5 rounded-md text-sm font-medium ${
          booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
          booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
          booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {t(`admin.bookings.filterStatus.${booking.status}` as const)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer info */}
        <div className="p-6 rounded-md bg-card border border-border">
          <h2 className="text-lg font-bold text-foreground mb-4">{t('admin.bookings.detail.customerInfo')}</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-muted-foreground">{t('admin.bookings.detail.name')}</dt>
              <dd className="text-sm font-medium text-foreground">{booking.customerName}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">{t('admin.bookings.detail.phone')}</dt>
              <dd className="text-sm font-medium text-foreground" dir="ltr">{booking.customerPhone}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">{t('admin.bookings.detail.email')}</dt>
              <dd className="text-sm font-medium text-foreground" dir="ltr">{booking.customerEmail}</dd>
            </div>
          </dl>
        </div>

        {/* Rental info */}
        <div className="p-6 rounded-md bg-card border border-border">
          <h2 className="text-lg font-bold text-foreground mb-4">{t('admin.bookings.detail.rentalInfo')}</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-muted-foreground">{t('admin.bookings.detail.product')}</dt>
              <dd className="text-sm font-medium text-foreground">
                {booking.product
                  ? localizedName(booking.product.nameAr, booking.product.nameEn, locale)
                  : (locale === 'ar' ? 'باقة عيد الميلاد' : 'Birthday Package')}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">{t('admin.bookings.detail.startDate')}</dt>
              <dd className="text-sm font-medium text-foreground">{booking.startDate.split('T')[0]}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">{t('admin.bookings.detail.endDate')}</dt>
              <dd className="text-sm font-medium text-foreground">{booking.endDate.split('T')[0]}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">{t('admin.bookings.detail.days')}</dt>
              <dd className="text-sm font-medium text-foreground">{days}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Financial summary */}
      <div className="p-6 rounded-md bg-stone-50 border border-border">
        <h2 className="text-lg font-bold text-foreground mb-4">{t('admin.bookings.detail.financialSummary')}</h2>
        <div className="space-y-2 max-w-md">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('admin.bookings.detail.rental')}</span>
            <span className="font-medium text-foreground">{rentalAmount.toFixed(3)} {booking.currency}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('admin.bookings.detail.deposit')}</span>
            <span className="font-medium text-foreground">{depositAmount.toFixed(3)} {booking.currency}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-border">
            <span className="font-bold text-foreground">{t('admin.bookings.detail.total')}</span>
            <span className="text-lg font-bold text-lut">{booking.totalAmount.toFixed(3)} {booking.currency}</span>
          </div>
        </div>
      </div>

      {/* Status change buttons */}
      <div className="p-6 rounded-md bg-card border border-border">
        <h2 className="text-lg font-bold text-foreground mb-4">{t('admin.bookings.detail.changeStatus')}</h2>
        <div className="flex flex-wrap gap-3">
          {booking.status === 'PENDING' && (
            <>
              <Button
                onClick={() => handleStatusChange('CONFIRMED')}
                disabled={updating}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 me-2" />}
                {t('admin.bookings.detail.confirm')}
              </Button>
              <Button
                onClick={() => handleStatusChange('CANCELLED')}
                disabled={updating}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <X className="w-4 h-4 me-2" />
                {t('admin.bookings.detail.cancel')}
              </Button>
            </>
          )}
          {booking.status === 'CONFIRMED' && (
            <>
              <Button
                onClick={() => handleStatusChange('COMPLETED')}
                disabled={updating}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4 me-2" />}
                {t('admin.bookings.detail.complete')}
              </Button>
              <Button
                onClick={() => handleStatusChange('CANCELLED')}
                disabled={updating}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <X className="w-4 h-4 me-2" />
                {t('admin.bookings.detail.cancel')}
              </Button>
            </>
          )}
          {(booking.status === 'CANCELLED' || booking.status === 'COMPLETED') && (
            <p className="text-sm text-muted-foreground">
              {t('admin.bookings.terminalState')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
