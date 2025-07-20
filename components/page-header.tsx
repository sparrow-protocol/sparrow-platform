import type React from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
}

function PageHeader({ className, as: Comp = "section", ...props }: PageHeaderProps) {
  return <Comp className={cn("grid gap-1", className)} {...props} />
}

function PageHeaderHeading({ className, as: Comp = "h1", ...props }: PageHeaderProps) {
  return (
    <Comp
      className={cn("text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]", className)}
      {...props}
    />
  )
}

function PageHeaderDescription({ className, as: Comp = "p", ...props }: PageHeaderProps) {
  return <Comp className={cn("max-w-[750px] text-lg text-muted-foreground sm:text-xl", className)} {...props} />
}

function PageHeaderActions({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center justify-center space-x-2 md:justify-start", className)} {...props} />
}

export { PageHeader, PageHeaderHeading, PageHeaderDescription, PageHeaderActions }
