import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { getProductBySlug, getRelatedProducts } from '@/lib/products'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Breadcrumbs } from '@/components/product/breadcrumbs'
import { ProductGallery } from '@/components/product/product-gallery'
import { Product3DViewer } from '@/components/product/product-3d-viewer'
import { ProductInfo } from '@/components/product/product-info'
import { RelatedProducts } from '@/components/product/related-products'
import { TrustBadges } from '@/components/product/trust-badges'
import { JsonLd } from '@/components/seo/json-ld'
import { buildMetadata } from '@/lib/seo'

interface PageProps {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateStaticParams() {
  const products = await db.product.findMany({
    where: { isActive: true },
    select: { slug: true },
  })
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const product = await getProductBySlug(slug)
  if (!product) return buildMetadata({ locale: locale as 'ar' | 'en', path: '/products' })

  return buildMetadata({
    locale: locale as 'ar' | 'en',
    path: `/products/${slug}`,
    title: locale === 'ar' ? product.nameAr : product.nameEn,
    description: locale === 'ar' ? product.descriptionAr : product.descriptionEn,
    image: product.images[0],
  })
}

export default async function ProductPage({ params }: PageProps) {
  const { slug, locale } = await params

  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const related = await getRelatedProducts(product.id, product.categoryId)

  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.nameEn,
    description: product.descriptionEn,
    image: product.images,
    sku: product.id,
    brand: { '@type': 'Brand', name: 'Last Unique Touch' },
    category: product.category.nameEn,
    offers: {
      '@type': 'Offer',
      price: product.rentalPricePerDay,
      priceCurrency: 'KWD',
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: product.rentalPricePerDay,
        priceCurrency: 'KWD',
        unitText: 'per day',
      },
    },
  }

  return (
    <>
      <JsonLd data={productLd} />
      <Navbar />
      <main className="min-h-screen bg-background" id="main-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <Breadcrumbs
            categorySlug={product.category.slug}
            categoryNameAr={product.category.nameAr}
            categoryNameEn={product.category.nameEn}
            productName={locale === 'ar' ? product.nameAr : product.nameEn}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Gallery + 3D */}
            <div>
              <ProductGallery
                images={product.images}
                model3dUrl={product.model3dUrl}
                productName={product.nameAr}
              />
              {product.model3dUrl && (
                <Product3DViewer productSlug={product.slug} />
              )}
            </div>

            {/* Right: Product Info */}
            <div>
              <ProductInfo product={product} />
            </div>
          </div>

          <TrustBadges />

          {related.length > 0 && (
            <RelatedProducts products={related} />
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
