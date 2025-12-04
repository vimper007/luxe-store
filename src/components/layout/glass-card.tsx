"use client"

import { cn } from "@/lib/utils"

type GlassCardProps = {
  children: React.ReactNode
  className?: string
}

export function GlassCard({ children, className }: GlassCardProps) {
  return <div className={cn("glass-panel p-6", className)}>{children}</div>
}
