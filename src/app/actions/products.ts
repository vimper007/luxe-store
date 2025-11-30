'use server'

import { revalidatePath } from 'next/cache'

import { db } from '@/lib/db'
import { products } from '@/db/schema'
import { productSchema } from '@/lib/validations/product'

export async function createProduct(formData: FormData) {
  try {
    const parsed = productSchema.safeParse({
      name: formData.get('name'),
      description: formData.get('description'),
      price: formData.get('price'),
      stock: formData.get('stock'),
      category: formData.get('category'),
    })

    if (!parsed.success) {
      return { error: 'Invalid product data' }
    }

    const data = parsed.data

    await db.insert(products).values({
      name: data.name,
      description: data.description,
      price: data.price.toString(),
      stock: data.stock,
      category: data.category,
      images: [],
      isFeatured: false,
    })

    revalidatePath('/admin/products')
    return { success: true }
  } catch (error) {
    console.error('Failed to create product', error)
    return { error: 'Failed to create product' }
  }
}
