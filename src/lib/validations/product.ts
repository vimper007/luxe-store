import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be zero or greater'),
  stock: z.number().int().min(0, 'Stock must be an integer zero or greater'),
  category: z.string().min(1, 'Category is required'),
})

export type ProductInput = z.infer<typeof productSchema>
