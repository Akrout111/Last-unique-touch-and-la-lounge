'use server'

import { z } from 'zod'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { stringifyImages } from '@/lib/products'
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
    const existing = await db.product.findUnique({ where: { slug: parsed.data.slug } })
    if (existing) {
      return { success: false, error: 'slug_exists' }
    }

    await db.product.create({
      data: {
        ...parsed.data,
        brand: 'LUT',
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
    const existing = await db.product.findFirst({
      where: { slug: parsed.data.slug, NOT: { id } },
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

  try {
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
