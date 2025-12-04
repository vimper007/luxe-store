import Link from "next/link"
import { notFound } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { products } from "@/db/schema/products"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/layout/glass-card"

type Props = { params: { slug: string } }

export default async function ProductDetailPage({ params }: Props) {
  let item = null
  try {
    item = await db.query.products.findFirst({
      where: eq(products.slug, params.slug),
    })
  } catch {
    item = {
      id: 0,
      name: "Sample Product",
      slug: params.slug,
      description: "Placeholder product while data loads.",
      category: "Concept",
      price: "199.00",
      stock: 0,
      images: [],
      rating: "4.5",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }

  if (!item) return notFound()

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard className="min-h-[320px]">
          <div className="h-80 rounded-xl bg-white/10" />
        </GlassCard>
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold">{item.name}</h1>
          <p className="text-sm text-muted-foreground">{item.category}</p>
          <p className="text-xl font-semibold">${Number(item.price).toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">
            {item.description ?? "Premium product coming soon."}
          </p>
          <div className="flex gap-3">
            <Button>Add to Cart</Button>
            <Button variant="ghost" asChild>
              <Link href="/shop">Back to shop</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Related products</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <GlassCard key={i} className="space-y-2 p-4">
              <div className="h-28 rounded-lg bg-white/10" />
              <p className="text-sm text-muted-foreground">More coming soon</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  )
}
