"use client"

import { Input } from "@/components/ui/input"
import { useWallet } from "@solana/wallet-adapter-react"
import QRCode from "qrcode.react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatAddress } from "@/app/lib/format/address"
import { CopyButton } from "@/components/copy-button"
import { createSolanaPayUrl } from "@/app/lib/solana/solana-pay-url"
import { Skeleton } from "@/components/ui/skeleton"

export function ReceivePaymentCard() {
  const { publicKey, connected } = useWallet()

  if (!connected || !publicKey) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Receive Solana Pay</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 flex flex-col items-center">
          <Skeleton className="h-64 w-64 rounded-lg" />
          <Skeleton className="h-8 w-full" />
          <p className="text-sm text-muted-foreground text-center">
            Connect your wallet to generate your receive QR code.
          </p>
        </CardContent>
      </Card>
    )
  }

  const formattedAddress = formatAddress(publicKey.toBase58())
  const solanaPayUrl = createSolanaPayUrl({
    recipient: publicKey,
    amount: 0, // Amount 0 means any amount can be sent
    message: "Sparrow Web App Receive",
  })

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Receive Solana Pay</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col items-center">
        <div className="p-2 border rounded-lg">
          <QRCode value={solanaPayUrl.toString()} size={256} level="H" />
        </div>
        <div className="flex items-center space-x-2 w-full">
          <Input readOnly value={publicKey.toBase58()} className="flex-grow" />
          <CopyButton value={publicKey.toBase58()} />
        </div>
        <p className="text-sm text-muted-foreground text-center">Share this QR code or address to receive payments.</p>
      </CardContent>
    </Card>
  )
}
