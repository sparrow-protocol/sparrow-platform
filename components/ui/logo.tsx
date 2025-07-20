import { Icons } from "@/components/ui/icons"
import { siteConfig } from "@/config/site"
import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="mr-6 flex items-center space-x-2">
      <Icons.wallet className="h-6 w-6" />
      <span className="hidden font-bold sm:inline-block">{siteConfig.name}</span>
    </Link>
  )
}
