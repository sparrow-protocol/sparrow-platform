import type * as React from "react"
import { cn } from "@/lib/utils"

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
  layout?: "default" | "dashboard" | "auth" | "marketing" | "centered"
}

export function Shell({ children, as: Comp = "section", layout = "default", className, ...props }: ShellProps) {
  return (
    <Comp
      className={cn(
        "grid items-center gap-8 pb-8 pt-6 md:py-8",
        {
          "container max-w-screen-xl": layout === "default",
          "container max-w-screen-2xl": layout === "dashboard",
          "container max-w-lg": layout === "auth",
          "container max-w-screen-xl": layout === "marketing",
          "container flex min-h-[calc(100vh-8rem)] flex-col justify-center py-8": layout === "centered",
        },
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}
