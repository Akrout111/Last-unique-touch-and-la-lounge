import { getCategoriesByBrand } from '@/lib/products'
import { ProductForm } from '@/components/admin/product-form'

export default async function NewProductPage() {
  const categories = await getCategoriesByBrand()
  return <ProductForm categories={categories} mode="create" />
}
