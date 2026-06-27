import { db } from './db'

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

export async function getAdminStats(): Promise<AdminStats> {
  const [
    totalProducts,
    pendingBookings,
    confirmedBookings,
    recentBookings,
    lowStockProducts,
    monthlyRevenue,
  ] = await Promise.all([
    db.product.count({ where: { isActive: true } }),
    db.booking.count({ where: { status: 'PENDING' } }),
    db.booking.count({ where: { status: 'CONFIRMED' } }),
    db.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: { id: true, nameAr: true, nameEn: true, slug: true },
        },
      },
    }),
    db.product.findMany({
      where: { stock: { lte: 2 }, isActive: true },
      take: 5,
      select: { id: true, nameAr: true, nameEn: true, slug: true, stock: true },
    }),
    db.booking.aggregate({
      where: {
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
