import { PageShell } from "@/components/layout/page-shell"
import { GlassCard } from "@/components/layout/glass-card"

export default function AdminDashboardPage() {
  return (
    <PageShell
      title="Admin Dashboard"
      subtitle="Overview of revenue, orders, and inventory."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <GlassCard>Revenue — coming soon</GlassCard>
        <GlassCard>Orders — coming soon</GlassCard>
        <GlassCard>Inventory — coming soon</GlassCard>
      </div>
    </PageShell>
  )
}
