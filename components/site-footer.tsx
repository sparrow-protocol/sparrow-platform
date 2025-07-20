import Link from "next/link"
import { Icons } from "@/components/ui/icons"
import { siteConfig } from "@/config/site"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background py-8">
      <div className="container flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-3">
          <div className="flex items-center gap-2">
            <Icons.wallet className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Sparrow</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © 2025 Sparrow Protocol. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-4">
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icons.twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icons.github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>
          <div className="hidden md:flex md:gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
