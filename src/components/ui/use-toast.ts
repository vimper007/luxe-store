import * as React from "react"

export type ToastActionElement = React.ReactNode
export type ToastVariant = "default" | "destructive"

export type Toast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  duration?: number
  variant?: ToastVariant
}

const listeners = new Set<(toast: Toast[]) => void>()
let memoryToasts: Toast[] = []

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)

function notify() {
  listeners.forEach((listener) => listener(memoryToasts))
}

export function toast(toast: Omit<Toast, "id">) {
  const id = createId()
  const nextToast: Toast = {
    id,
    duration: 4000,
    variant: "default",
    ...toast,
  }

  memoryToasts = [...memoryToasts, nextToast]
  notify()

  return {
    id,
    dismiss: () => dismissToast(id),
  }
}

function dismissToast(id: string) {
  memoryToasts = memoryToasts.filter((toast) => toast.id !== id)
  notify()
}

export function useToast() {
  const [toasts, setToasts] = React.useState<Toast[]>(memoryToasts)

  React.useEffect(() => {
    listeners.add(setToasts)
    return () => {
      listeners.delete(setToasts)
    }
  }, [])

  return {
    toasts,
    toast,
    dismiss: dismissToast,
  }
}
