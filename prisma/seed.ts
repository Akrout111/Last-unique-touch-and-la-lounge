// Seed file for Last Unique Touch — Phase 1
// Uses @/ aliases (works with bun + tsconfig paths)

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // 1. Create categories for LUT brand
  const chairs = await prisma.category.upsert({
    where: { slug: 'chairs' },
    update: {},
    create: {
      slug: 'chairs',
      brand: 'LUT',
      nameAr: 'كراسي',
      nameEn: 'Chairs',
    },
  })

  const tables = await prisma.category.upsert({
    where: { slug: 'tables' },
    update: {},
    create: {
      slug: 'tables',
      brand: 'LUT',
      nameAr: 'طاولات',
      nameEn: 'Tables',
    },
  })

  const lighting = await prisma.category.upsert({
    where: { slug: 'lighting' },
    update: {},
    create: {
      slug: 'lighting',
      brand: 'LUT',
      nameAr: 'إضاءة',
      nameEn: 'Lighting',
    },
  })

  console.log('✅ Categories created:', [chairs, tables, lighting].length)

  // 2. Create sample products (2 per category)
  const products = [
    {
      slug: 'louis-ghost-chair',
      brand: 'LUT' as const,
      nameAr: 'كرسي لويس غوست',
      nameEn: 'Louis Ghost Chair',
      descriptionAr: 'كرسي شفاف أنيق من تصميم فيليب ستارك، مثالي للفعاليات الفاخرة',
      descriptionEn: 'Elegant transparent chair designed by Philippe Starck, perfect for luxury events',
      rentalPricePerDay: 5.0,
      securityDeposit: 15.0,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800',
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      ]),
      stock: 50,
      categoryId: chairs.id,
    },
    {
      slug: 'chivari-chair-gold',
      brand: 'LUT' as const,
      nameAr: 'كرسي كييفاري ذهبي',
      nameEn: 'Chivari Chair Gold',
      descriptionAr: 'كرسي كييفاري ذهبي كلاسيكي للمناسبات الرسمية والأفراح',
      descriptionEn: 'Classic gold Chivari chair for formal events and weddings',
      rentalPricePerDay: 3.5,
      securityDeposit: 10.0,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1519947486511-4614b4c5e4c2?w=800',
      ]),
      stock: 100,
      categoryId: chairs.id,
    },
    {
      slug: 'round-banquet-table',
      brand: 'LUT' as const,
      nameAr: 'طاولة بنكت دائرية',
      nameEn: 'Round Banquet Table',
      descriptionAr: 'طاولة دائرية كبيرة لجلوس 10 أشخاص، مثالية للعشاء الرسمي',
      descriptionEn: 'Large round table seating 10, ideal for formal dinners',
      rentalPricePerDay: 8.0,
      securityDeposit: 25.0,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1517164850305-99a3e65bb47e?w=800',
      ]),
      stock: 20,
      categoryId: tables.id,
    },
    {
      slug: 'cocktail-highboy-table',
      brand: 'LUT' as const,
      nameAr: 'طاولة كوكتيل عالية',
      nameEn: 'Cocktail Highboy Table',
      descriptionAr: 'طاولة كوكتيل عالية أنيقة للحفلات والاستقبالات',
      descriptionEn: 'Elegant cocktail highboy table for parties and receptions',
      rentalPricePerDay: 4.0,
      securityDeposit: 12.0,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
      ]),
      stock: 40,
      categoryId: tables.id,
    },
    {
      slug: 'crystal-chandelier',
      brand: 'LUT' as const,
      nameAr: 'ثريا كريستال',
      nameEn: 'Crystal Chandelier',
      descriptionAr: 'ثريا كريستال فاخرة تضيف لمسة ملكية لأي فعالية',
      descriptionEn: 'Luxury crystal chandelier adding a royal touch to any event',
      rentalPricePerDay: 15.0,
      securityDeposit: 50.0,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800',
      ]),
      stock: 8,
      categoryId: lighting.id,
    },
    {
      slug: 'led-uplighter',
      brand: 'LUT' as const,
      nameAr: 'سبوت لايد ملون',
      nameEn: 'LED Uplighter',
      descriptionAr: 'إضاءة LED ملونة قابلة للتحكم عن بعد لتلوين المساحة',
      descriptionEn: 'Remote-controlled color LED uplighter for ambient lighting',
      rentalPricePerDay: 3.0,
      securityDeposit: 8.0,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=800',
      ]),
      stock: 60,
      categoryId: lighting.id,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }

  console.log('✅ Products created:', products.length)
  console.log('🌱 Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
