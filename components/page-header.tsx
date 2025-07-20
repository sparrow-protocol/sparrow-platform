import type React from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
}

function PageHeader({ className, as: Comp = "section", ...props }: PageHeaderProps) {
  return <Comp className={cn("flex flex-col items-start gap-2 px-2 py-8 md:py-12", className)} {...props} />
}

interface PageHeaderHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: React.ElementType
}

function PageHeaderHeading({ className, as: Comp = "h1", ...props }: PageHeaderHeadingProps) {
  return (
    <Comp
      className={cn("text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]", className)}
      {...props}
    />
  )
}

interface PageHeaderDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: React.ElementType
}

function PageHeaderDescription({ className, as: Comp = "p", ...props }: PageHeaderDescriptionProps) {
  return <Comp className={cn("max-w-[750px] text-lg text-muted-foreground sm:text-xl", className)} {...props} />
}

export { PageHeader, PageHeaderHeading, PageHeaderDescription }
