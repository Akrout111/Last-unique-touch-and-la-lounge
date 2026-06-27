import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'
import { db } from '@/lib/db'
import { BookingDetail } from '@/components/admin/booking-detail'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminBookingDetailPage({ params }: PageProps) {
  const locale = await getLocale()
  const { id } = await params

  const booking = await db.booking.findUnique({
    where: { id },
    include: {
      product: {
        include: {
          category: { select: { nameAr: true, nameEn: true } },
        },
      },
    },
  })

  if (!booking) notFound()

  const formatted = {
    id: booking.id,
    status: booking.status,
    startDate: booking.startDate.toISOString(),
    endDate: booking.endDate.toISOString(),
    totalAmount: booking.totalAmount,
    currency: booking.currency,
    createdAt: booking.createdAt.toISOString(),
    customerName: booking.customerName,
    customerPhone: booking.customerPhone,
    customerEmail: booking.customerEmail,
    product: {
      nameAr: booking.product.nameAr,
      nameEn: booking.product.nameEn,
      slug: booking.product.slug,
      rentalPricePerDay: booking.product.rentalPricePerDay,
      securityDeposit: booking.product.securityDeposit,
      categoryNameAr: booking.product.category.nameAr,
      categoryNameEn: booking.product.category.nameEn,
    },
  }

  return <BookingDetail booking={formatted} locale={locale} />
}
