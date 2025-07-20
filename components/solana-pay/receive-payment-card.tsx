"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { generateSolanaPayQR } from "@/app/lib/solana/solana-pay-url"
import { PublicKey } from "@solana/web3.js"
import QRCode from "react-qr-code"
import { usePrivy } from "@privy-io/react-auth"
import { useWallets } from "@privy-io/react-auth/wallets"

export function ReceivePaymentCard() {
  const { user } = usePrivy()
  const { wallets } = useWallets()
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy")

  const [amount, setAmount] = useState("0.01")
  const [qrCodeSvg, setQrCodeSvg] = useState<string | null>(null)

  const recipientAddress = embeddedWallet?.address || user?.wallet?.address || ""
  const recipientPublicKey = recipientAddress ? new PublicKey(recipientAddress) : null

  useEffect(() => {
    if (recipientPublicKey && amount) {
      try {
        const qr = generateSolanaPayQR(recipientPublicKey, Number.parseFloat(amount))
        setQrCodeSvg(qr)
      } catch (error) {
        console.error("Error generating QR code:", error)
        setQrCodeSvg(null)
      }
    } else {
      setQrCodeSvg(null)
    }
  }, [recipientPublicKey, amount])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Receive Solana Payment</CardTitle>
        <CardDescription>Generate a Solana Pay QR code to receive SOL.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="receiveAmount">Amount (SOL)</Label>
          <Input
            id="receiveAmount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="any"
          />
        </div>
        {recipientAddress ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Your address: {recipientAddress.slice(0, 6)}...{recipientAddress.slice(-4)}
            </p>
            {qrCodeSvg ? (
              <div className="flex justify-center p-4 bg-white rounded-md">
                <QRCode value={qrCodeSvg} size={256} viewBox={`0 0 256 256`} />
              </div>
            ) : (
              <p className="text-center text-red-500">
                Error generating QR code. Please check your address and amount.
              </p>
            )}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">Connect your wallet to generate a QR code.</p>
        )}
      </CardContent>
    </Card>
  )
}
