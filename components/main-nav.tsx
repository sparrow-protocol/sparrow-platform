"use client"
import Link from "next/link"
import { useSelectedLayoutSegment } from "next/navigation"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/ui/icons"

export function MainNav() {
  const segment = useSelectedLayoutSegment()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Icons.logo className="h-6 w-6" aria-hidden="true" />
        <span className="hidden font-bold sm:inline-block">{siteConfig.name}</span>
        <span className="sr-only">Home</span>
      </Link>
      <nav className="flex items-center gap-6 text-sm font-medium">
        <Link
          href="/dashboard"
          className={cn(
            "transition-colors hover:text-foreground/80",
            segment === "dashboard" ? "text-foreground" : "text-foreground/60",
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/swap"
          className={cn(
            "transition-colors hover:text-foreground/80",
            segment === "swap" ? "text-foreground" : "text-foreground/60",
          )}
        >
          Swap
        </Link>
        <Link
          href="/pay"
          className={cn(
            "transition-colors hover:text-foreground/80",
            segment === "pay" ? "text-foreground" : "text-foreground/60",
          )}
        >
          Pay
        </Link>
        <Link
          href="/faucet"
          className={cn(
            "transition-colors hover:text-foreground/80",
            segment === "faucet" ? "text-foreground" : "text-foreground/60",
          )}
        >
          Faucet
        </Link>
        <Link
          href={siteConfig.links.github}
          className={cn("hidden text-foreground/60 transition-colors hover:text-foreground/80 lg:block")}
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </Link>
      </nav>
    </div>
  )
}
