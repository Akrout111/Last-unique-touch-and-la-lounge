'use server'

import { z } from 'zod'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { stringifyImages } from '@/lib/products'
import { getAdminBrand } from '@/lib/admin-brand'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const productSchema = z.object({
  nameAr: z.string().min(1).max(200),
  nameEn: z.string().min(1).max(200),
  descriptionAr: z.string().min(1),
  descriptionEn: z.string().min(1),
  categoryId: z.string().min(1),
  rentalPricePerDay: z.number().positive(),
  securityDeposit: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  images: z.array(z.string().url()).min(1),
  model3dUrl: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean(),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
})

export async function createProductAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
  await requireAuth()

  const imagesRaw = formData.get('images') as string
  let images: string[] = []
  try {
    images = JSON.parse(imagesRaw)
  } catch {
    return { success: false, error: 'invalid_input' }
  }

  const parsed = productSchema.safeParse({
    nameAr: formData.get('nameAr'),
    nameEn: formData.get('nameEn'),
    descriptionAr: formData.get('descriptionAr'),
    descriptionEn: formData.get('descriptionEn'),
    categoryId: formData.get('categoryId'),
    rentalPricePerDay: parseFloat(formData.get('rentalPricePerDay') as string),
    securityDeposit: parseFloat(formData.get('securityDeposit') as string),
    stock: parseInt(formData.get('stock') as string, 10),
    images,
    model3dUrl: (formData.get('model3dUrl') as string) || '',
    isActive: formData.get('isActive') === 'true',
    slug: formData.get('slug'),
  })

  if (!parsed.success) {
    return { success: false, error: 'invalid_input' }
  }

  let shouldRedirect = false
  try {
    // Read brand from cookie so admin can create products for the currently
    // selected tenant. Falls back to 'LUT' for backwards compatibility.
    const brand = await getAdminBrand()

    // Use findFirst because `slug` is no longer globally unique — it's only
    // unique within a brand (`@@unique([brand, slug])`). The duplicate-slug
    // check must therefore be scoped to the same brand the new product will
    // belong to, otherwise we'd block creating the same slug in a different
    // tenant.
    const existing = await db.product.findFirst({
      where: { slug: parsed.data.slug, brand },
    })
    if (existing) {
      return { success: false, error: 'slug_exists' }
    }

    await db.product.create({
      data: {
        ...parsed.data,
        brand,
        model3dUrl: parsed.data.model3dUrl || null,
        images: stringifyImages(parsed.data.images),
      },
    })

    revalidatePath('/admin/products')
    shouldRedirect = true
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error'
    console.error('Create product error:', message, error)
    return { success: false, error: 'internal_error' }
  }

  if (shouldRedirect) {
    redirect('/admin/products')
  }
  return { success: false, error: 'internal_error' }
}

export async function updateProductAction(id: string, formData: FormData): Promise<{ success: boolean; error?: string }> {
  await requireAuth()

  const imagesRaw = formData.get('images') as string
  let images: string[] = []
  try {
    images = JSON.parse(imagesRaw)
  } catch {
    return { success: false, error: 'invalid_input' }
  }

  const parsed = productSchema.safeParse({
    nameAr: formData.get('nameAr'),
    nameEn: formData.get('nameEn'),
    descriptionAr: formData.get('descriptionAr'),
    descriptionEn: formData.get('descriptionEn'),
    categoryId: formData.get('categoryId'),
    rentalPricePerDay: parseFloat(formData.get('rentalPricePerDay') as string),
    securityDeposit: parseFloat(formData.get('securityDeposit') as string),
    stock: parseInt(formData.get('stock') as string, 10),
    images,
    model3dUrl: (formData.get('model3dUrl') as string) || '',
    isActive: formData.get('isActive') === 'true',
    slug: formData.get('slug'),
  })

  if (!parsed.success) {
    return { success: false, error: 'invalid_input' }
  }

  let shouldRedirect = false
  try {
    const brand = await getAdminBrand()

    // Ensure the product belongs to the current admin brand before editing.
    // Without this check an admin could update another tenant's product by id.
    const owned = await db.product.findFirst({ where: { id, brand } })
    if (!owned) {
      return { success: false, error: 'not_found' }
    }

    // Duplicate-slug check is scoped to the same brand because
    // `@@unique([brand, slug])` only enforces uniqueness within a tenant.
    const existing = await db.product.findFirst({
      where: { slug: parsed.data.slug, brand, NOT: { id } },
    })
    if (existing) {
      return { success: false, error: 'slug_exists' }
    }

    await db.product.update({
      where: { id },
      data: {
        ...parsed.data,
        model3dUrl: parsed.data.model3dUrl || null,
        images: stringifyImages(parsed.data.images),
      },
    })

    revalidatePath('/admin/products')
    shouldRedirect = true
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error'
    console.error('Update product error:', message, error)
    return { success: false, error: 'internal_error' }
  }

  if (shouldRedirect) {
    redirect('/admin/products')
  }
  return { success: false, error: 'internal_error' }
}

export async function deleteProductAction(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAuth()
  const brand = await getAdminBrand()

  try {
    // Verify ownership before deleting (cross-tenant protection)
    const owned = await db.product.findFirst({ where: { id, brand } })
    if (!owned) return { success: false, error: 'not_found' }

    // Soft delete — set isActive to false
    await db.product.update({
      where: { id },
      data: { isActive: false },
    })

    revalidatePath('/admin/products')
    return { success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error'
    console.error('Delete product error:', message, error)
    return { success: false, error: 'internal_error' }
  }
}
