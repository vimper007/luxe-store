'use server'

import { z } from "zod"

const cartSchema = z.object({
  productId: z.number(),
  quantity: z.number().int().min(1),
})

export async function addToCartAction(input: z.infer<typeof cartSchema>) {
  const parsed = cartSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: "Invalid cart payload" }
  }
  return { success: true }
}
