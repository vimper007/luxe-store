import Link from "next/link"

import { db } from "@/lib/db"
import { products } from "@/db/schema/products"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/layout/glass-card"

type ProductRow = typeof products.$inferSelect

const fallbackProducts: ProductRow[] = [
  {
    id: 0,
    name: "Luxe Placeholder",
    slug: "luxe-placeholder",
    description: "Premium mock product while data loads.",
    category: "Concept",
    price: "199.00",
    stock: 10,
    images: [],
    rating: "4.5",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export default async function ShopPage() {
  let items: ProductRow[] = fallbackProducts
  try {
    items = await db.select().from(products).limit(24)
  } catch {
    // fallback to static items if DB is unavailable
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Shop</h1>
          <p className="text-sm text-muted-foreground">Discover curated luxury.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {items.map((item) => (
          <GlassCard key={item.id} className="space-y-3 p-4">
            <div className="h-40 rounded-xl bg-white/10" />
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.category}</p>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>${Number(item.price).toFixed(2)}</span>
              <div className="flex gap-2">
                <Button asChild size="sm" variant="ghost">
                  <Link href={`/shop/${item.slug}`}>View</Link>
                </Button>
              </div>
            </div>
          </GlassCard>
        ))}
        {items.length === 0 && (
          <div className="text-sm text-muted-foreground">No products available.</div>
        )}
      </div>
    </div>
  )
}
