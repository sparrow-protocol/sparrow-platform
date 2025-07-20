"use client"

import { useEmbeddedWallet } from "@/app/hooks/use-embedded-wallet"
import { shortenAddress } from "@/app/lib/format"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CopyButton } from "@/components/copy-button"
import { usePrivy } from "@privy-io/react-auth"

export function EmbeddedWalletCard() {
  const { embeddedWallet, embeddedWalletAddress } = useEmbeddedWallet()
  const { exportWallet } = usePrivy()

  if (!embeddedWallet) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Embedded Wallet</CardTitle>
        <CardDescription>Your secure, non-custodial wallet powered by Privy.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-md border p-3 font-mono text-sm">
          <span>{shortenAddress(embeddedWalletAddress || "")}</span>
          <CopyButton value={embeddedWalletAddress || ""} />
        </div>
        <Button onClick={exportWallet} className="w-full">
          Export Wallet
        </Button>
      </CardContent>
    </Card>
  )
}
