import { ProductsGridSkeleton } from '@/components/products/products-grid-skeleton'

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" role="status" aria-live="polite">
      {/* Page header skeleton */}
      <div className="mb-8 space-y-2">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-4 w-72 bg-muted rounded animate-pulse" />
      </div>

      {/* Result count skeleton */}
      <div className="mb-6 h-4 w-24 bg-muted rounded animate-pulse" />

      {/* Skeleton grid */}
      <ProductsGridSkeleton />

      {/* Pagination skeleton */}
      <div className="mt-8 flex justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-9 w-9 rounded-md bg-muted animate-pulse"
          />
        ))}
      </div>
    </div>
  )
}
