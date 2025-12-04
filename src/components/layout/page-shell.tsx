"use client"

import * as React from "react"

type PageShellProps = {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export function PageShell({ children, title, subtitle }: PageShellProps) {
  return (
    <section className="space-y-6">
      {(title || subtitle) && (
        <header className="space-y-2">
          {title && <h1 className="text-3xl font-semibold leading-tight">{title}</h1>}
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </header>
      )}
      <div className="glass-panel p-6 md:p-8">{children}</div>
    </section>
  )
}
