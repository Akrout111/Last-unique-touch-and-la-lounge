// Seed file for Last Unique Touch — Phase 3
// 15 products with AI-generated images matching each product

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // 1. Create categories for LUT brand
  // NOTE: `slug` is no longer globally unique — only unique within a brand
  // (`@@unique([brand, slug])`). Use the compound unique selector for upserts.
  const chairs = await prisma.category.upsert({
    where: { category_brand_slug_unique: { brand: 'LUT', slug: 'chairs' } },
    update: {},
    create: {
      slug: 'chairs',
      brand: 'LUT',
      nameAr: 'كراسي',
      nameEn: 'Chairs',
    },
  })

  const tables = await prisma.category.upsert({
    where: { category_brand_slug_unique: { brand: 'LUT', slug: 'tables' } },
    update: {},
    create: {
      slug: 'tables',
      brand: 'LUT',
      nameAr: 'طاولات',
      nameEn: 'Tables',
    },
  })

  const lighting = await prisma.category.upsert({
    where: { category_brand_slug_unique: { brand: 'LUT', slug: 'lighting' } },
    update: {},
    create: {
      slug: 'lighting',
      brand: 'LUT',
      nameAr: 'إضاءة',
      nameEn: 'Lighting',
    },
  })

  console.log('✅ Categories created:', [chairs, tables, lighting].length)

  // 2. Create 15 products with AI-generated images
  const products = [
    // ===== CHAIRS (5) =====
    {
      slug: 'louis-ghost-chair',
      brand: 'LUT' as const,
      nameAr: 'كرسي لويس غوست',
      nameEn: 'Louis Ghost Chair',
      descriptionAr: 'كرسي شفاف أنيق من تصميم فيليب ستارك، مثالي للفعاليات الفاخرة',
      descriptionEn: 'Elegant transparent chair designed by Philippe Starck, perfect for luxury events',
      rentalPricePerDay: 5.0,
      securityDeposit: 15.0,
      images: JSON.stringify(['/products/louis-ghost-chair.png']),
      model3dUrl: 'procedural-chair',
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
      images: JSON.stringify(['/products/chivari-chair-gold.png']),
      stock: 100,
      categoryId: chairs.id,
    },
    {
      slug: 'tiffany-chair-crystal',
      brand: 'LUT' as const,
      nameAr: 'كرسي تيفاني كريستال',
      nameEn: 'Tiffany Chair Crystal',
      descriptionAr: 'كرسي تيفاني شفاف بإطار فولاذي مقاوم للصدأ، أناقة عصرية',
      descriptionEn: 'Transparent Tiffany chair with stainless steel frame, modern elegance',
      rentalPricePerDay: 4.0,
      securityDeposit: 12.0,
      images: JSON.stringify(['/products/tiffany-chair-crystal.png']),
      model3dUrl: 'procedural-chair',
      stock: 80,
      categoryId: chairs.id,
    },
    {
      slug: 'monet-armchair',
      brand: 'LUT' as const,
      nameAr: 'كرسي منته بذراعين',
      nameEn: 'Monet Armchair',
      descriptionAr: 'كرسي بذراعين بتصميم كلاسيكي وتنجيد فاخر بلون كريمي',
      descriptionEn: 'Classic armchair with luxury cream upholstery and elegant design',
      rentalPricePerDay: 6.5,
      securityDeposit: 20.0,
      images: JSON.stringify(['/products/monet-armchair.png']),
      stock: 30,
      categoryId: chairs.id,
    },
    {
      slug: 'bombon-chair-velvet',
      brand: 'LUT' as const,
      nameAr: 'كرسي بومبون مخمل',
      nameEn: 'Bombon Velvet Chair',
      descriptionAr: 'كرسي بومبون بقماش مخمل فاخر متوفر بألوان متعددة',
      descriptionEn: 'Bombon chair with luxury velvet fabric available in multiple colors',
      rentalPricePerDay: 5.5,
      securityDeposit: 18.0,
      images: JSON.stringify(['/products/bombon-chair-velvet.png']),
      stock: 0,
      categoryId: chairs.id,
    },

    // ===== TABLES (5) =====
    {
      slug: 'round-banquet-table',
      brand: 'LUT' as const,
      nameAr: 'طاولة بنكت دائرية',
      nameEn: 'Round Banquet Table',
      descriptionAr: 'طاولة دائرية كبيرة لجلوس 10 أشخاص، مثالية للعشاء الرسمي',
      descriptionEn: 'Large round table seating 10, ideal for formal dinners',
      rentalPricePerDay: 8.0,
      securityDeposit: 25.0,
      images: JSON.stringify(['/products/round-banquet-table.png']),
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
      images: JSON.stringify(['/products/cocktail-highboy-table.png']),
      stock: 40,
      categoryId: tables.id,
    },
    {
      slug: 'marble-coffee-table',
      brand: 'LUT' as const,
      nameAr: 'طاولة قهوة رخامية',
      nameEn: 'Marble Coffee Table',
      descriptionAr: 'طاولة قهوة بسطح رخامي فاخر وقاعدة ذهبية، لمسة من الفخامة',
      descriptionEn: 'Coffee table with luxury marble top and gold base, a touch of elegance',
      rentalPricePerDay: 7.0,
      securityDeposit: 22.0,
      images: JSON.stringify(['/products/marble-coffee-table.png']),
      model3dUrl: 'procedural-table',
      stock: 15,
      categoryId: tables.id,
    },
    {
      slug: 'dining-table-12-seater',
      brand: 'LUT' as const,
      nameAr: 'طاولة طعام 12 شخص',
      nameEn: 'Dining Table 12 Seater',
      descriptionAr: 'طاولة طعام طويلة تتسع لـ 12 شخصاً، مثالية للعزائم الكبيرة',
      descriptionEn: 'Long dining table seating 12, perfect for large gatherings',
      rentalPricePerDay: 12.0,
      securityDeposit: 35.0,
      images: JSON.stringify(['/products/dining-table-12-seater.png']),
      stock: 10,
      categoryId: tables.id,
    },
    {
      slug: 'gold-side-table',
      brand: 'LUT' as const,
      nameAr: 'طاولة جانبية ذهبية',
      nameEn: 'Gold Side Table',
      descriptionAr: 'طاولة جانبية صغيرة بإطار ذهبي لامع، قطعة ديكور أنيقة',
      descriptionEn: 'Small side table with shiny gold frame, an elegant decor piece',
      rentalPricePerDay: 3.5,
      securityDeposit: 10.0,
      images: JSON.stringify(['/products/gold-side-table.png']),
      stock: 25,
      categoryId: tables.id,
    },

    // ===== LIGHTING (5) =====
    {
      slug: 'crystal-chandelier',
      brand: 'LUT' as const,
      nameAr: 'ثريا كريستال',
      nameEn: 'Crystal Chandelier',
      descriptionAr: 'ثريا كريستال فاخرة تضيف لمسة ملكية لأي فعالية',
      descriptionEn: 'Luxury crystal chandelier adding a royal touch to any event',
      rentalPricePerDay: 15.0,
      securityDeposit: 50.0,
      images: JSON.stringify(['/products/crystal-chandelier.png']),
      model3dUrl: 'procedural-chandelier',
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
      images: JSON.stringify(['/products/led-uplighter.png']),
      stock: 60,
      categoryId: lighting.id,
    },
    {
      slug: 'industrial-pendant-light',
      brand: 'LUT' as const,
      nameAr: 'إنارة معلقة صناعية',
      nameEn: 'Industrial Pendant Light',
      descriptionAr: 'إنارة معلقة بتصميم صناعي عصري، مثالية للمساحات المفتوحة',
      descriptionEn: 'Pendant light with modern industrial design, perfect for open spaces',
      rentalPricePerDay: 4.5,
      securityDeposit: 14.0,
      images: JSON.stringify(['/products/industrial-pendant-light.png']),
      stock: 35,
      categoryId: lighting.id,
    },
    {
      slug: 'brass-lantern',
      brand: 'LUT' as const,
      nameAr: 'فانوس نحاسي',
      nameEn: 'Brass Lantern',
      descriptionAr: 'فانوس نحاسي كلاسيكي بلمسة تراثية، مثالي للفعاليات الرمضانية والأعراس',
      descriptionEn: 'Classic brass lantern with heritage touch, ideal for Ramadan events and weddings',
      rentalPricePerDay: 6.0,
      securityDeposit: 18.0,
      images: JSON.stringify(['/products/brass-lantern.png']),
      stock: 45,
      categoryId: lighting.id,
    },
    {
      slug: 'gold-floor-lamp',
      brand: 'LUT' as const,
      nameAr: 'أباجورة ذهبية أرضية',
      nameEn: 'Gold Floor Lamp',
      descriptionAr: 'أباجورة أرضية بقاعدة ذهبية وإضاءة دافئة، لمسة فخامة لأي ركن',
      descriptionEn: 'Floor lamp with gold base and warm light, a touch of luxury for any corner',
      rentalPricePerDay: 5.0,
      securityDeposit: 16.0,
      images: JSON.stringify(['/products/gold-floor-lamp.png']),
      model3dUrl: 'procedural-lamp',
      stock: 18,
      categoryId: lighting.id,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: {
        product_brand_slug_unique: { brand: product.brand, slug: product.slug },
      },
      update: {
        ...product,
        images: product.images,
        model3dUrl: product.model3dUrl ?? null,
      },
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
