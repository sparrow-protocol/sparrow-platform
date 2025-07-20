"use client"

import * as React from "react"
import { useSelectedLayoutSegment } from "next/navigation"

import type { NavItem } from "@/app/types/nav"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/ui/icons"
import { MobileLink } from "@/components/mobile-link" // Corrected import
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area" // Added ScrollArea import
import { Button } from "@/components/ui/button" // Added Button import

interface MobileNavProps {
  items?: NavItem[]
  children?: React.ReactNode
}

export function MobileNav({ items, children }: MobileNavProps) {
  const segment = useSelectedLayoutSegment()
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <svg strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
            <path d="M3 5H11" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M3 12H16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M3 19H21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <MobileLink href="/" className="flex items-center" onOpenChange={setOpen}>
          <Icons.logo className="mr-2 h-4 w-4" />
          <span className="font-bold">{siteConfig.name}</span>
        </MobileLink>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col gap-2 p-4">
            {items?.map((item, index) => (
              <MobileLink
                key={index}
                href={item.disabled ? "#" : item.href}
                className={cn(
                  "text-foreground/70",
                  item.href.startsWith(`/${segment}`) && "text-foreground",
                  item.disabled && "cursor-not-allowed opacity-60",
                )}
                onOpenChange={setOpen}
              >
                {item.title}
              </MobileLink>
            ))}
            <MobileLink
              href="/dashboard"
              className={cn("text-foreground/70", segment === "dashboard" && "text-foreground")}
              onOpenChange={setOpen}
            >
              Dashboard
            </MobileLink>
            <MobileLink
              href="/swap"
              className={cn("text-foreground/70", segment === "swap" && "text-foreground")}
              onOpenChange={setOpen}
            >
              Swap
            </MobileLink>
            <MobileLink
              href="/pay"
              className={cn("text-foreground/70", segment === "pay" && "text-foreground")}
              onOpenChange={setOpen}
            >
              Pay
            </MobileLink>
            <MobileLink
              href="/faucet"
              className={cn("text-foreground/70", segment === "faucet" && "text-foreground")}
              onOpenChange={setOpen}
            >
              Faucet
            </MobileLink>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
