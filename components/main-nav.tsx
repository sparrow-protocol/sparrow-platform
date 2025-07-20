"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/ui/icons"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Icons.wallet className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">{siteConfig.name}</span>
      </Link>
      <nav className="flex items-center gap-6 text-sm">
        <Link
          href="/dashboard"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/dashboard" ? "text-foreground" : "text-foreground/60",
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/swap"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/swap" ? "text-foreground" : "text-foreground/60",
          )}
        >
          Swap
        </Link>
        <Link
          href="/chat"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/chat" ? "text-foreground" : "text-foreground/60",
          )}
        >
          AI Chat
        </Link>
        <Link
          href="/settings"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/settings" ? "text-foreground" : "text-foreground/60",
          )}
        >
          Settings
        </Link>
      </nav>
    </div>
  )
}
