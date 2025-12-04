import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "@/db/schema/products"
import * as ordersSchema from "@/db/schema/orders"
import * as orderItemsSchema from "@/db/schema/order-items"
import * as reviewsSchema from "@/db/schema/reviews"

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set in environment variables")
}

const sql = neon(databaseUrl)
export const db = drizzle(sql, {
  schema: { ...schema, ...ordersSchema, ...orderItemsSchema, ...reviewsSchema },
})
