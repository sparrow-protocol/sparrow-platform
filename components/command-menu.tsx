"use client"

import * as React from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { fetchJupiterTokenList } from "@/app/lib/defi-api"
import type { JupiterToken } from "@/app/types/jupiter"

interface CommandMenuProps {
  onTokenSelect: (token: JupiterToken) => void
  selectedToken?: JupiterToken
  placeholder?: string
}

export function CommandMenu({ onTokenSelect, selectedToken, placeholder = "Search tokens..." }: CommandMenuProps) {
  const [open, setOpen] = React.useState(false)
  const [tokens, setTokens] = React.useState<JupiterToken[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const loadTokens = async () => {
      setLoading(true)
      try {
        const tokenList = await fetchJupiterTokenList()
        setTokens(tokenList.slice(0, 100)) // Limit to first 100 tokens for performance
      } catch (error) {
        console.error("Failed to load tokens:", error)
      } finally {
        setLoading(false)
      }
    }

    if (open) {
      loadTokens()
    }
  }, [open])

  const handleSelect = (token: JupiterToken) => {
    onTokenSelect(token)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start bg-transparent">
          {selectedToken ? (
            <div className="flex items-center gap-2">
              {selectedToken.logoURI && (
                <img
                  src={selectedToken.logoURI || "/placeholder.svg"}
                  alt={selectedToken.symbol}
                  className="w-4 h-4 rounded-full"
                />
              )}
              <span>{selectedToken.symbol}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>{placeholder}</span>
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0">
        <Command>
          <CommandInput placeholder="Search tokens..." />
          <CommandList>
            <CommandEmpty>{loading ? "Loading tokens..." : "No tokens found."}</CommandEmpty>
            <CommandGroup>
              {tokens.map((token) => (
                <CommandItem
                  key={token.address}
                  value={`${token.symbol} ${token.name}`}
                  onSelect={() => handleSelect(token)}
                  className="flex items-center gap-2"
                >
                  {token.logoURI && (
                    <img
                      src={token.logoURI || "/placeholder.svg"}
                      alt={token.symbol}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium">{token.symbol}</span>
                    <span className="text-sm text-muted-foreground">{token.name}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
