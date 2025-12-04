'use server'

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { products } from "@/db/schema/products"
import { db } from "@/lib/db"

const productInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1).optional(),
  price: z.number().positive("Price must be positive"),
  stock: z.number().int().min(0, "Stock must be zero or greater"),
  category: z.string().min(1, "Category is required"),
  images: z.array(z.string().url()).default([]),
  slug: z.string().min(1).optional(),
})

export type CreateProductInput = z.infer<typeof productInputSchema>
export type CreateProductResult = { success: boolean; error?: string }

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)

export async function createProduct(input: CreateProductInput): Promise<CreateProductResult> {
  const parsed = productInputSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors.map((e) => e.message).join(", ") }
  }

  const data = parsed.data
  const slug = data.slug ? slugify(data.slug) : slugify(data.name)

  try {
    await db.insert(products).values({
      name: data.name,
      slug,
      description: data.description ?? null,
      price: data.price.toString(),
      stock: data.stock,
      category: data.category,
      images: data.images.length ? data.images : null,
    })

    revalidatePath("/admin/products")
    return { success: true }
  } catch (error) {
    console.error("createProduct error", error)
    return { success: false, error: "Failed to create product" }
  }
}
