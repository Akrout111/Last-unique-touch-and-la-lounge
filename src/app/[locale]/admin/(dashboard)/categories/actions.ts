'use server'

import { z } from 'zod'
import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

const categorySchema = z.object({
  nameAr: z.string().min(1).max(100),
  nameEn: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
})

export async function createCategoryAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
  await requireAuth()

  const parsed = categorySchema.safeParse({
    nameAr: formData.get('nameAr'),
    nameEn: formData.get('nameEn'),
    slug: formData.get('slug'),
  })

  if (!parsed.success) {
    return { success: false, error: 'invalid_input' }
  }

  try {
    const existing = await db.category.findUnique({ where: { slug: parsed.data.slug } })
    if (existing) {
      return { success: false, error: 'slug_exists' }
    }

    await db.category.create({
      data: {
        ...parsed.data,
        brand: 'LUT',
      },
    })

    revalidatePath('/admin/categories')
    return { success: true }
  } catch (error: unknown) {
    console.error('Create category error:', error)
    return { success: false, error: 'internal_error' }
  }
}

export async function updateCategoryAction(id: string, formData: FormData): Promise<{ success: boolean; error?: string }> {
  await requireAuth()

  const parsed = categorySchema.safeParse({
    nameAr: formData.get('nameAr'),
    nameEn: formData.get('nameEn'),
    slug: formData.get('slug'),
  })

  if (!parsed.success) {
    return { success: false, error: 'invalid_input' }
  }

  try {
    const existing = await db.category.findFirst({
      where: { slug: parsed.data.slug, NOT: { id } },
    })
    if (existing) {
      return { success: false, error: 'slug_exists' }
    }

    await db.category.update({
      where: { id },
      data: parsed.data,
    })

    revalidatePath('/admin/categories')
    return { success: true }
  } catch (error: unknown) {
    console.error('Update category error:', error)
    return { success: false, error: 'internal_error' }
  }
}

export async function deleteCategoryAction(id: string): Promise<{ success: boolean; error?: string }> {
  await requireAuth()

  try {
    // Check if category has products
    const productCount = await db.product.count({ where: { categoryId: id } })
    if (productCount > 0) {
      return { success: false, error: 'has_products' }
    }

    await db.category.delete({ where: { id } })

    revalidatePath('/admin/categories')
    return { success: true }
  } catch (error: unknown) {
    console.error('Delete category error:', error)
    return { success: false, error: 'internal_error' }
  }
}
