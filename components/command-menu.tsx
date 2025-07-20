"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import type { DialogProps } from "@radix-ui/react-dialog"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

export function CommandMenu({ ...props }: DialogProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:hidden lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Icons.search className="h-4 w-4" />
        <span className="hidden lg:inline-flex">Search...</span>
        <span className="inline-flex lg:hidden">Search</span>
        <kbd className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Links">
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>Dashboard</CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/swap"))}>Swap</CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/chat"))}>AI Chat</CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/settings"))}>Settings</CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/profile"))}>Profile</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => router.push("/#"))}>Light</CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/#"))}>Dark</CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/#"))}>System</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
