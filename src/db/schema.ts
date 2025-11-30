import {
  pgTable,
  uuid,
  text,
  decimal,
  integer,
  timestamp,
  json,
  boolean,
} from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull().default(0),
  images: json('images').default([]),
  category: text('category').notNull(),
  isFeatured: boolean('is_featured').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  status: text('status', { enum: ['pending', 'paid', 'shipped'] }).default(
    'pending',
  ),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  items: json('items').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
