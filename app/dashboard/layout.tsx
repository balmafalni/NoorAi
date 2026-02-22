"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  PlusCircle,
  Clock,
  Sliders,
  Settings,
  Menu,
  LogOut,
  CreditCard,
} from "lucide-react"

const sidebarItems = [
  { label: "New Reel", href: "/dashboard", icon: PlusCircle },
  { label: "History", href: "/dashboard/history", icon: Clock },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard }, // ✅ added
  { label: "Presets", href: "/dashboard/presets", icon: Sliders },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

function SidebarContent({
  pathname,
  onNavigate,
}: {
  pathname: string
  onNavigate?: () => void
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sidebar-primary">
          <span className="text-xs font-bold text-sidebar-primary-foreground">N</span>
        </div>
        <span className="text-sm font-semibold text-sidebar-foreground">NoorAi</span>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border px-3 py-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent">
            <span className="text-xs font-medium text-sidebar-accent-foreground">A</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-sidebar-foreground">Ahmed</p>
            <p className="truncate text-xs text-sidebar-foreground/60">Creator Plan</p>
          </div>
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-sidebar-foreground/60 hover:text-sidebar-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Sign out</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar for mobile */}
        <header className="flex h-14 items-center gap-3 border-b border-border bg-background px-4 lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 bg-sidebar p-0">
              <SidebarContent pathname={pathname} onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
              <span className="text-[10px] font-bold text-primary-foreground">N</span>
            </div>
            <span className="text-sm font-semibold text-foreground">NoorAi</span>
          </div>

          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>

        {/* Desktop top-right theme toggle */}
        <div className="hidden lg:block">
          <div className="flex h-14 items-center justify-end border-b border-border px-6">
            <ThemeToggle />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}