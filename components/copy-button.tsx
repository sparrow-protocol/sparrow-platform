"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"

interface CopyButtonProps extends ButtonProps {
  value: string
  copyLabel?: string
  copiedLabel?: string
}

export function CopyButton({
  value,
  className,
  copyLabel = "Copy",
  copiedLabel = "Copied",
  ...props
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }, [hasCopied])

  return (
    <Button
      size="icon"
      variant="ghost"
      className={cn("relative z-10 h-6 w-6 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50", className)}
      onClick={() => {
        navigator.clipboard.writeText(value)
        setHasCopied(true)
      }}
      {...props}
    >
      <span className="sr-only">{hasCopied ? copiedLabel : copyLabel}</span>
      {hasCopied ? <CheckIcon className="h-3 w-3" /> : <CopyIcon className="h-3 w-3" />}
    </Button>
  )
}
