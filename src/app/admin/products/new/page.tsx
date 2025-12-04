"use client"

import { PageShell } from "@/components/layout/page-shell"
import NewProductForm from "./_components/new-product-form"

export default function NewProductPage() {
  return (
    <div className="space-y-8">
      <PageShell
        title="New Product"
        subtitle="Create a new Luxe product. Set up pricing, inventory, and media."
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-panel p-6">
              <NewProductForm />
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-6">
              <h3 className="text-lg font-semibold">Media & Meta</h3>
              <p className="text-sm text-muted-foreground">
                Image upload and status controls will appear here.
              </p>
              <div className="mt-4 h-40 rounded-2xl border border-white/10 bg-white/5" />
            </div>
          </div>
        </div>
      </PageShell>
    </div>
  )
}
