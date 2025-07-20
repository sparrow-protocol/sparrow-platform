import { GitHubLogoIcon, HomeIcon, TwitterLogoIcon } from "@radix-ui/react-icons"

import type { LucideIcon, CodeIcon as ClassValue } from "lucide-react"
import { cn } from "@/lib/utils"

export type IconProps = {
  className?: ClassValue
}

export type Icon = LucideIcon

export const Icons = {
  logo: ({ className }: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className={cn("h-6 w-6", className)}>
      <path fill="none" d="M0 0H256V256H0z" />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
        d="M208 128L128 208 48 128M128 48L48 128l80 80"
      />
    </svg>
  ),
  home: HomeIcon,
  gitHub: GitHubLogoIcon,
  twitter: TwitterLogoIcon,
  close: ({ className }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-4 w-4", className)}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  ),
}
