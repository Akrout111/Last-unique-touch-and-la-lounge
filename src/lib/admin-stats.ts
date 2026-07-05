import { db } from './db'
import type { Brand } from '@prisma/client'

export interface AdminStats {
  totalProducts: number
  pendingBookings: number
  confirmedBookings: number
  monthlyRevenue: number
  recentBookings: Array<{
    id: string
    customerName: string
    customerPhone: string
    startDate: Date
    endDate: Date
    status: string
    totalAmount: number
    product: {
      id: string
      nameAr: string
      nameEn: string
      slug: string
    }
  }>
  lowStockProducts: Array<{
    id: string
    nameAr: string
    nameEn: string
    slug: string
    stock: number
  }>
}

/**
 * Aggregate stats for the admin dashboard.
 *
 * `brand` is optional. When provided, every query (product counts, booking
 * counts, recent bookings, low-stock products, monthly revenue) is scoped to
 * that tenant — fixing the multi-tenant bug where stats from one brand would
 * leak into another brand's dashboard. When omitted, queries remain unscoped
 * (kept for backwards compatibility).
 */
export async function getAdminStats(brand?: Brand): Promise<AdminStats> {
  const brandFilter = brand ? { brand } : {}

  const [
    totalProducts,
    pendingBookings,
    confirmedBookings,
    recentBookings,
    lowStockProducts,
    monthlyRevenue,
  ] = await Promise.all([
    db.product.count({ where: { ...brandFilter, isActive: true } }),
    db.booking.count({ where: { ...brandFilter, status: 'PENDING' } }),
    db.booking.count({ where: { ...brandFilter, status: 'CONFIRMED' } }),
    db.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      where: { ...brandFilter, product: { isNot: null } },
      include: {
        product: {
          select: { id: true, nameAr: true, nameEn: true, slug: true },
        },
      },
    }).then((rows) =>
      rows.map((r) => ({ ...r, product: r.product! }))
    ),
    db.product.findMany({
      where: { ...brandFilter, stock: { lte: 2 }, isActive: true },
      take: 5,
      select: { id: true, nameAr: true, nameEn: true, slug: true, stock: true },
    }),
    db.booking.aggregate({
      where: {
        ...brandFilter,
        status: 'CONFIRMED',
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
      _sum: { totalAmount: true },
    }),
  ])

  return {
    totalProducts,
    pendingBookings,
    confirmedBookings,
    recentBookings,
    lowStockProducts,
    monthlyRevenue: monthlyRevenue._sum.totalAmount || 0,
  }
}
