'use server'

import { revalidatePath } from "next/cache"

import { products } from "@/db/schema"
import { db } from "@/lib/db"
import { productSchema, type ProductInput } from "@/lib/validations/product"

export async function createProduct(data: ProductInput) {
  try {
    const parsed = productSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: "Invalid product data" }
    }

    const payload = parsed.data

    await db.insert(products).values({
      name: payload.name,
      category: payload.category,
      price: payload.price.toString(),
      stock: payload.stock,
      description: payload.description,
      images: payload.images ?? [],
      isFeatured: false,
    })

    revalidatePath("/admin/products")
    return { success: true }
  } catch (error) {
    console.error("Failed to create product", error)
    return { success: false, error: "Failed to create product" }
  }
}
