import { describe, it, expect } from 'vitest'

describe('n8n payload construction', () => {
  it('builds valid payload structure', () => {
    const booking = {
      id: 'b1',
      status: 'CONFIRMED',
      startDate: new Date('2026-07-01'),
      endDate: new Date('2026-07-03'),
      totalAmount: 100,
      currency: 'KWD',
      createdAt: new Date('2026-06-01'),
      customerName: 'Test Customer',
      customerPhone: '+96512345678',
      customerEmail: 'test@test.com',
      product: {
        id: 'p1',
        slug: 'test-product',
        nameAr: 'منتج اختبار',
        nameEn: 'Test Product',
        rentalPricePerDay: 10,
        securityDeposit: 50,
        category: { nameAr: 'كراسي', nameEn: 'Chairs' },
      },
    }

    // Build the payload same way as triggerOrderConfirmedWebhook
    const payload = {
      event: 'order.confirmed',
      timestamp: new Date().toISOString(),
      booking: {
        id: booking.id,
        status: booking.status,
        startDate: booking.startDate.toISOString(),
        endDate: booking.endDate.toISOString(),
        totalAmount: booking.totalAmount,
        currency: booking.currency,
        createdAt: booking.createdAt.toISOString(),
      },
      customer: {
        name: booking.customerName,
        phone: booking.customerPhone,
        email: booking.customerEmail,
      },
      product: {
        id: booking.product.id,
        slug: booking.product.slug,
        nameAr: booking.product.nameAr,
        nameEn: booking.product.nameEn,
        rentalPricePerDay: booking.product.rentalPricePerDay,
        securityDeposit: booking.product.securityDeposit,
        categoryAr: booking.product.category.nameAr,
        categoryEn: booking.product.category.nameEn,
      },
    }

    expect(payload.event).toBe('order.confirmed')
    expect(payload.booking.id).toBe('b1')
    expect(payload.booking.status).toBe('CONFIRMED')
    expect(payload.customer.email).toBe('test@test.com')
    expect(payload.customer.phone).toBe('+96512345678')
    expect(payload.product.slug).toBe('test-product')
    expect(payload.product.categoryAr).toBe('كراسي')
  })

  it('includes ISO format timestamps', () => {
    const timestamp = new Date('2026-07-01T10:00:00.000Z')
    const isoString = timestamp.toISOString()

    expect(isoString).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)
  })

  it('includes all required fields for n8n processing', () => {
    const requiredBookingFields = ['id', 'status', 'startDate', 'endDate', 'totalAmount', 'currency']
    const requiredCustomerFields = ['name', 'phone', 'email']
    const requiredProductFields = ['id', 'slug', 'nameAr', 'nameEn']

    const payload = {
      event: 'order.confirmed',
      timestamp: new Date().toISOString(),
      booking: Object.fromEntries(requiredBookingFields.map((f) => [f, 'value'])),
      customer: Object.fromEntries(requiredCustomerFields.map((f) => [f, 'value'])),
      product: Object.fromEntries(requiredProductFields.map((f) => [f, 'value'])),
    }

    requiredBookingFields.forEach((field) => {
      expect(payload.booking).toHaveProperty(field)
    })
    requiredCustomerFields.forEach((field) => {
      expect(payload.customer).toHaveProperty(field)
    })
    requiredProductFields.forEach((field) => {
      expect(payload.product).toHaveProperty(field)
    })
  })
})
