import type React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface CallToActionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
  buttonText: string
  buttonHref: string
}

export function CallToAction({ title, description, buttonText, buttonHref, className, ...props }: CallToActionProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4 p-8 text-center", className)} {...props}>
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{title}</h2>
      <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
        {description}
      </p>
      <Button asChild>
        <Link href={buttonHref}>{buttonText}</Link>
      </Button>
    </div>
  )
}
