import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { getFeaturedProducts } from '@/lib/products'
import { ProductCard } from './product-card'

export async function FeaturedProducts() {
  const products = await getFeaturedProducts(4)

  return <FeaturedProductsContent products={products} />
}

function FeaturedProductsContent({ products }: { products: Awaited<ReturnType<typeof getFeaturedProducts>> }) {
  const t = useTranslations()

  return (
    <section className="py-20 sm:py-28 bg-bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            {t('featured.title')}
          </h2>
          <Link
            href="/products"
            className="text-sm font-medium text-lut hover:underline"
          >
            {t('featured.viewAll')} &rarr;
          </Link>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
