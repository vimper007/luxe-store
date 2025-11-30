'use server'

import { revalidatePath } from 'next/cache'

import { db } from '@/lib/db'
import { products } from '@/db/schema'
import { productSchema, type ProductInput } from '@/lib/validations/product'

export async function createProduct(data: ProductInput) {
  try {
    const parsed = productSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: 'Invalid product data' }
    }

    const payload = parsed.data

    await db.insert(products).values({
      name: payload.name,
      description: payload.description,
      price: payload.price.toString(),
      stock: payload.stock,
      category: payload.category,
      images: payload.images ?? [],
      isFeatured: false,
    })

    revalidatePath('/admin/products')
    return { success: true }
  } catch (error) {
    console.error('Failed to create product', error)
    return { success: false, error: 'Failed to create product' }
  }
}
