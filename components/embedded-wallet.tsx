"use client"

import { usePrivy, useWallets } from "@privy-io/react-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CopyButton } from "@/components/copy-button"
import { formatAddress } from "@/app/lib/format/address"
import { SOLANA_EXPLORER_URL } from "@/app/lib/constants"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

export function EmbeddedWallet() {
  const { user } = usePrivy()
  const { wallets } = useWallets()

  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy")

  if (!user || !embeddedWallet) {
    return null
  }

  const walletAddress = embeddedWallet.address

  return (
    <Card>
      <CardHeader>
        <CardTitle>Embedded Wallet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium">Address:</p>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-sm">{formatAddress(walletAddress)}</span>
            <CopyButton value={walletAddress} />
            <Button variant="ghost" size="icon" asChild>
              <Link href={`${SOLANA_EXPLORER_URL}/address/${walletAddress}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">View on Solana Explorer</span>
              </Link>
            </Button>
          </div>
        </div>
        <Button onClick={embeddedWallet.exportWallet}>Export Wallet</Button>
        <Button onClick={embeddedWallet.linkAccount}>Link Another Account</Button>
      </CardContent>
    </Card>
  )
}
