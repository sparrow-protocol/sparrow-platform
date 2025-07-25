import type React from "react"
import { cn } from "@/lib/utils"

interface HeroSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
  children?: React.ReactNode
}

export function HeroSection({ title, description, children, className, ...props }: HeroSectionProps) {
  return (
    <section className={cn("w-full py-12 md:py-24 lg:py-32 xl:py-48", className)} {...props}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">{title}</h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </section>
  )
}
