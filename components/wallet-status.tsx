"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { usePrivy } from "@privy-io/react-auth"
import { useEmbeddedWallet } from "@/app/hooks/use-embedded-wallet"
import { shortenAddress } from "@/app/lib/format"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { WalletIcon } from "lucide-react"

export function WalletStatus() {
  const { connected, publicKey } = useWallet()
  const { embeddedWalletAddress } = useEmbeddedWallet()
  const { authenticated } = usePrivy()

  const displayAddress = embeddedWalletAddress || publicKey?.toBase58()

  if (!authenticated) {
    return null // Only show wallet status if authenticated
  }

  if (!connected && !embeddedWalletAddress) {
    return <WalletMultiButton />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <WalletIcon className="h-4 w-4" />
          {displayAddress ? shortenAddress(displayAddress) : "Connect Wallet"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-default">
          Connected: {displayAddress ? shortenAddress(displayAddress) : "N/A"}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <WalletMultiButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
