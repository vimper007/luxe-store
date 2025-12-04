"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ThemeToggleProps = {
  className?: string
  icons?: {
    light?: React.ReactNode
    dark?: React.ReactNode
  }
}

export function ThemeToggle({ className, icons }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const current = resolvedTheme ?? theme ?? "dark"
  const isDark = current === "dark"

  const lightIcon = icons?.light ?? <Sun className="size-4" />
  const darkIcon = icons?.dark ?? <Moon className="size-4" />

  return (
    <Button
      type="button"
      variant="outline"
      className={cn("h-10 w-10 rounded-full p-0", className)}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {mounted ? (isDark ? lightIcon : darkIcon) : <div className="size-4" />}
    </Button>
  )
}
