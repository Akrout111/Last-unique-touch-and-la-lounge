import { notFound } from 'next/navigation'
import { getProductById, getCategoriesByBrand } from '@/lib/products'
import { ProductForm } from '@/components/admin/product-form'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params

  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategoriesByBrand(),
  ])

  if (!product) notFound()

  return <ProductForm categories={categories} product={product} mode="edit" />
}
