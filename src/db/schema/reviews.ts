import { pgTable, serial, integer, text, numeric, timestamp } from "drizzle-orm/pg-core"
import { products } from "./products"

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull(),
  rating: numeric("rating", { precision: 2, scale: 1 }).notNull(),
  text: text("text"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
})

export type Review = typeof reviews.$inferSelect
export type NewReview = typeof reviews.$inferInsert
