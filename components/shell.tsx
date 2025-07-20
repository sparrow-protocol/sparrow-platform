import type * as React from "react"

import { cn } from "@/lib/utils"

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
}

export function Shell({ as: Comp = "div", className, children, ...props }: ShellProps) {
  return (
    <Comp className={cn("grid items-start gap-8", className)} {...props}>
      {children}
    </Comp>
  )
}
