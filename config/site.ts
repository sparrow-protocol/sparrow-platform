import type { MainNavItem } from "types"

export const siteConfig = {
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
      title: "Transactions",
      href: "/transactions",
    },
    {
      title: "AI Chat",
      href: "/ai-chat",
    },
  ] satisfies MainNavItem[],
  links: {
    twitter: "https://twitter.com/vercel",
    github: "https://github.com/vercel/next.js",
    docs: "https://nextjs.org/docs",
  },
}
