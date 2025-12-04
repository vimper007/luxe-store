"use client"

import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "@/components/ui/toaster"
import { ReduxProvider } from "@/store"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ReduxProvider>
        {children}
        <Toaster />
      </ReduxProvider>
    </ClerkProvider>
  )
}
