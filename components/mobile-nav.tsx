"use client"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/ui/icons"
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll"
import { MobileLink } from "@/components/mobile-link"

interface MobileNavProps {
  items: {
    title: string
    href: string
    disabled?: boolean
  }[]
  onClose: () => void
}

export function MobileNav({ items, onClose }: MobileNavProps) {
  useLockBodyScroll()

  return (
    <div
      className={cn(
        "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden",
      )}
    >
      <div className="relative z-20 flex flex-col gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
        <Link href="/" className="flex items-center space-x-2">
          <Icons.logo className="h-6 w-6" />
          <span className="font-bold">{siteConfig.name}</span>
        </Link>
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          {items.map((item, index) => (
            <MobileLink
              key={index}
              href={item.href}
              onOpenChange={onClose}
              className={cn(
                "flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline",
                item.disabled && "cursor-not-allowed opacity-60",
              )}
            >
              {item.title}
            </MobileLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
