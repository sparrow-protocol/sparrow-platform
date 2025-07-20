import type React from "react"
export * from "./chart"
export * from "./transactions"
export * from "./users"
export * from "./jupiter"
export * from "./solana"
export * from "./ai"
export * from "./wallet"

// Centralized type definitions if needed

export type NavItem = {
  title: string
  href: string
  disabled?: boolean
}

export type MainNavItem = NavItem

export type SidebarNavItem = {
  title: string
  disabled?: boolean
  external?: boolean
  icon?: React.ElementType
} & (
  | {
      href: string
      items?: never
    }
  | {
      href?: string
      items: NavItem[]
    }
)

export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}
