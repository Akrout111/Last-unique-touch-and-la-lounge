import { notFound } from 'next/navigation'
import { getProductById, getCategoriesByBrand } from '@/lib/products'
import { ProductForm } from '@/components/admin/product-form'
import type { Brand } from '@prisma/client'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params

  const [product, categories] = await Promise.all([
    getProductById(id),
    // Categories scoped to the product's existing brand so the admin can't
    // accidentally reassign it to a category belonging to a different tenant.
    getProductById(id).then((p) => getCategoriesByBrand((p?.brand ?? 'LUT') as Brand)),
  ])

  if (!product) notFound()

  return <ProductForm categories={categories} product={product} mode="edit" brand={product.brand as 'LUT' | 'LA_LOUNGE' | 'YOUR_BIRTHDAY'} />
}
