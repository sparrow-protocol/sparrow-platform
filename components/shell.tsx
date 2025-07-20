import type * as React from "react"

import { cn } from "@/lib/utils"

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
}

function Shell({ className, as: Comp = "div", ...props }: ShellProps) {
  return <Comp className={cn("grid items-center gap-8 pb-8 pt-6 md:py-8", className)} {...props} />
}

export { Shell }
