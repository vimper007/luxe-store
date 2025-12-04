import Link from "next/link"

import { db } from "@/lib/db"
import { products } from "@/db/schema/products"
import { PageShell } from "@/components/layout/page-shell"
import { GlassCard } from "@/components/layout/glass-card"
import { Button } from "@/components/ui/button"

export default async function AdminProductsPage() {
  const rows = await db.select().from(products).limit(50)

  return (
    <PageShell
      title="Products"
      subtitle="Manage your Luxe catalog"
    >
      <div className="mb-4 flex justify-between">
        <div />
        <Button asChild>
          <Link href="/admin/products/new">New Product</Link>
        </Button>
      </div>
      <GlassCard className="overflow-hidden">
        <div className="grid grid-cols-6 gap-3 px-4 py-2 text-sm text-muted-foreground">
          <span className="col-span-2">Name</span>
          <span>Category</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-white/10">
          {rows.map((row) => (
            <div key={row.id} className="grid grid-cols-6 gap-3 px-4 py-3 text-sm">
              <span className="col-span-2 font-medium">{row.name}</span>
              <span>{row.category}</span>
              <span>${Number(row.price).toFixed(2)}</span>
              <span>{row.stock}</span>
              <span className="text-xs text-muted-foreground">Active</span>
            </div>
          ))}
          {rows.length === 0 && (
            <div className="px-4 py-6 text-sm text-muted-foreground">No products yet.</div>
          )}
        </div>
      </GlassCard>
    </PageShell>
  )
}
