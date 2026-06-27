import { getTranslations, getLocale } from 'next-intl/server'
import { db } from '@/lib/db'
import { localizedName } from '@/lib/products'
import { BookingsTable } from '@/components/admin/bookings-table'

interface PageProps {
  searchParams: Promise<{
    status?: string
    q?: string
  }>
}

export default async function AdminBookingsPage({ searchParams }: PageProps) {
  const t = await getTranslations()
  const locale = await getLocale()
  const { status, q } = await searchParams

  const where: Record<string, unknown> = {}
  if (status && status !== 'all') {
    where.status = status
  }
  if (q && q.trim()) {
    where.OR = [
      { customerName: { contains: q.trim() } },
      { customerPhone: { contains: q.trim() } },
      { customerEmail: { contains: q.trim() } },
    ]
  }

  const bookings = await db.booking.findMany({
    where,
    include: {
      product: {
        select: { id: true, nameAr: true, nameEn: true, slug: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  const formatted = bookings.map((b) => ({
    id: b.id,
    customerName: b.customerName,
    customerPhone: b.customerPhone,
    startDate: b.startDate.toISOString(),
    endDate: b.endDate.toISOString(),
    status: b.status,
    totalAmount: b.totalAmount,
    productName: localizedName(b.product.nameAr, b.product.nameEn, locale),
    productSlug: b.product.slug,
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">{t('admin.bookings.title')}</h1>
      <BookingsTable bookings={formatted} currentStatus={status ?? 'all'} currentSearch={q ?? ''} locale={locale} />
    </div>
  )
}
