"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { createPortal } from "react-dom"

import { ToastCard } from "./toast"
import { useToast } from "./use-toast"

export function Toaster() {
  const { toasts, dismiss } = useToast()
  const [mounted, setMounted] = React.useState(false)
  const timeouts = React.useRef(new Map<string, ReturnType<typeof setTimeout>>())

  React.useEffect(() => {
    setMounted(true)
    const timeoutsMap = timeouts.current
    return () => {
      timeoutsMap.forEach((timeout) => clearTimeout(timeout))
      timeoutsMap.clear()
    }
  }, [])

  React.useEffect(() => {
    const activeIds = new Set(toasts.map((toast) => toast.id))

    timeouts.current.forEach((timeout, id) => {
      if (!activeIds.has(id)) {
        clearTimeout(timeout)
        timeouts.current.delete(id)
      }
    })

    toasts.forEach((toast) => {
      if (timeouts.current.has(toast.id)) return

      const timeout = setTimeout(() => {
        dismiss(toast.id)
        timeouts.current.delete(toast.id)
      }, toast.duration ?? 4000)

      timeouts.current.set(toast.id, timeout)
    })
  }, [toasts, dismiss])

  if (!mounted) return null

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end gap-3 px-4 py-6 sm:p-6">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="pointer-events-auto"
          >
            <ToastCard {...toast} onClose={() => dismiss(toast.id)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  )
}
