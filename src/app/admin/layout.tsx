import { ReactNode } from "react"
import { redirect } from "next/navigation"
import { auth, currentUser } from "@clerk/nextjs/server"
import {
  Home,
  Package,
  ShoppingBag,
  Settings,
  Sun,
  Moon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/user-avatar"
import { ThemeToggle } from "@/components/ui/theme-toggle"

type AdminLayoutProps = {
  children: ReactNode
}

const navItems = [
  { label: "Dashboard", href: "/admin", icon: Home },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Settings", href: "/admin/settings", icon: Settings },
]

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const { userId } = auth()
  const user = userId ? await currentUser() : null

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 text-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 lg:flex-row lg:px-8">
        {/* Sidebar */}
        <aside className="glass-panel w-full rounded-3xl p-6 text-white lg:w-64 lg:shrink-0">
          <div className="mb-8 space-y-2">
            <div className="text-2xl font-semibold tracking-tight">Luxe Store</div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">
              Admin Command Center
            </p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  asChild
                  className="w-full justify-start gap-3 rounded-2xl bg-white/0 text-white hover:bg-white/10"
                >
                  <a href={item.href}>
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </a>
                </Button>
              )
            })}
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1 space-y-4">
          <header className="glass-panel flex items-center justify-between rounded-3xl px-4 py-3 text-white">
            <div className="space-y-1">
              <p className="text-sm text-white/60">Luxe Store Admin</p>
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle
                className="rounded-full border border-white/15 bg-white/5 text-white hover:bg-white/10"
                icons={{ light: <Sun className="size-4" />, dark: <Moon className="size-4" /> }}
              />
              <UserAvatar
                user={user}
                className="border border-white/10 shadow-lg"
                fallback={user?.firstName?.[0] ?? "U"}
              />
            </div>
          </header>

          <main className="glass-panel rounded-3xl p-6 text-white">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
