"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Toast } from "./use-toast"

export type ToastProps = Toast & {
  onClose?: () => void
}

export function ToastCard({ title, description, action, variant = "default", onClose }: ToastProps) {
  return (
    <div
      className={cn(
        "relative w-full min-w-[280px] max-w-sm overflow-hidden rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-xl",
        "bg-white/10 text-white",
        variant === "destructive" && "border-red-400/50 bg-red-500/15",
        variant === "default" && "border-white/15"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 space-y-1">
          {title && <p className="text-sm font-semibold leading-tight text-white">{title}</p>}
          {description && <p className="text-xs text-white/80 leading-relaxed">{description}</p>}
          {action}
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="text-white/60 transition hover:text-white"
            aria-label="Dismiss toast"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>
    </div>
  )
}
