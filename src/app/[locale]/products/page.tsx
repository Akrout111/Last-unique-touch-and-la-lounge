import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ProductsFilters } from '@/components/products/products-filters'
import { ProductsPageContent } from '@/components/products/products-page-content'
import { ProductsGridSkeleton } from '@/components/products/products-grid-skeleton'
import { getCategoriesByBrand, getProducts } from '@/lib/products'
import type { ProductSort } from '@/lib/products'

interface PageProps {
  searchParams: Promise<{
    category?: string
    q?: string
    sort?: string
    page?: string
  }>
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const t = await getTranslations()

  const params = await searchParams

  const categorySlug = params.category || undefined
  const search = params.q || undefined
  const sort: ProductSort =
    params.sort === 'price-asc' || params.sort === 'price-desc'
      ? params.sort
      : 'newest'
  const page = params.page ? Math.max(1, parseInt(params.page, 10) || 1) : 1

  const [categories, result] = await Promise.all([
    getCategoriesByBrand(),
    getProducts({ categorySlug, search, sort, page }),
  ])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              {t('products.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('products.subtitle')}
            </p>
          </div>

          {/* Filters */}
          <ProductsFilters
            categories={categories}
            activeCategory={categorySlug}
            search={search}
            sort={sort}
          />

          {/* Content with suspense */}
          <Suspense fallback={<ProductsGridSkeleton />}>
            <ProductsPageContent
              products={result.products}
              total={result.total}
              page={result.page}
              totalPages={result.totalPages}
              categorySlug={categorySlug}
              search={search}
              sort={sort}
            />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
