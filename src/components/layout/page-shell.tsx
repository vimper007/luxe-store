"use client"

import { GlassCard } from "./glass-card"

type PageShellProps = {
  title?: string
  subtitle?: string
  children: React.ReactNode
}

export function PageShell({ title, subtitle, children }: PageShellProps) {
  return (
    <section className="space-y-4">
      {(title || subtitle) && (
        <div className="space-y-1">
          {title && <h1 className="text-3xl font-semibold">{title}</h1>}
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      )}
      <GlassCard className="p-6 md:p-8">{children}</GlassCard>
    </section>
  )
}
