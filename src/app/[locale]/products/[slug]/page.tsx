import { notFound } from 'next/navigation'
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

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const products = await db.product.findMany({
    where: { isActive: true },
    select: { slug: true },
  })
  return products.map((p) => ({ slug: p.slug }))
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params

  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const related = await getRelatedProducts(product.id, product.categoryId)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <Breadcrumbs
            categorySlug={product.category.slug}
            categoryNameAr={product.category.nameAr}
            categoryNameEn={product.category.nameEn}
            productName={product.nameAr}
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
                <Product3DViewer modelUrl={product.model3dUrl} />
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
