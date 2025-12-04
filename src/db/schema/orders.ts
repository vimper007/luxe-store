import { pgEnum, pgTable, serial, text, numeric, timestamp } from "drizzle-orm/pg-core"

export const orderStatus = pgEnum("order_status", ["pending", "paid", "failed"])

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  status: orderStatus("status").notNull().default("pending"),
  stripeSessionId: text("stripe_session_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
})

export type Order = typeof orders.$inferSelect
export type NewOrder = typeof orders.$inferInsert
