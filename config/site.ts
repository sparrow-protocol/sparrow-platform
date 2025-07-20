import type { NavItem } from "@/app/types"

interface SiteConfig {
  name: string
  description: string
  mainNav: NavItem[]
  links: {
    twitter: string
    github: string
  }
}

export const siteConfig: SiteConfig = {
  name: "Sparrow",
  description: "A Solana DeFi web application.",
  mainNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
    },
    {
      title: "Swap",
      href: "/swap",
    },
    {
      title: "Pay",
      href: "/pay",
    },
    {
      title: "Faucet",
      href: "/faucet",
    },
    {
      title: "AI Chat",
      href: "/ai",
    },
  ],
  links: {
    twitter: "https://twitter.com/vercel",
    github: "https://github.com/vercel/next.js",
  },
}
