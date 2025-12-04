import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

import * as productsSchema from "./schema/products"
import * as ordersSchema from "./schema/orders"
import * as orderItemsSchema from "./schema/order-items"
import * as reviewsSchema from "./schema/reviews"

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set")
}

const sql = neon(databaseUrl)

export const db = drizzle(sql, {
  schema: { ...productsSchema, ...ordersSchema, ...orderItemsSchema, ...reviewsSchema },
})
