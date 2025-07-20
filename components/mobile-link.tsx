"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import type * as React from "react"

import { cn } from "@/lib/utils"

interface MobileLinkProps extends React.PropsWithChildren {
  href: string
  disabled?: boolean
  className?: string
  onOpenChange?: (open: boolean) => void
}

export function MobileLink({ href, disabled, children, className, onOpenChange }: MobileLinkProps) {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href)
        onOpenChange?.(false)
      }}
      className={cn(className)}
      aria-disabled={disabled}
    >
      {children}
    </Link>
  )
}
