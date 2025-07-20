"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { usePrivy } from "@privy-io/react-auth"
import { useWallets } from "@privy-io/react-auth/wallets"

export function FaucetCard() {
  const [recipientAddress, setRecipientAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const { user } = usePrivy()
  const { wallets } = useWallets()

  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy")
  const defaultAddress = embeddedWallet?.address || user?.wallet?.address || ""

  const handleRequestAirdrop = async () => {
    if (!recipientAddress) {
      toast.error("Please enter a recipient address.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/faucet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress: recipientAddress }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Airdrop successful!", {
          description: `Transaction Signature: ${data.signature}`,
        })
      } else {
        toast.error("Airdrop failed.", {
          description: data.error || "An unknown error occurred.",
        })
      }
    } catch (error) {
      console.error("Error requesting airdrop:", error)
      toast.error("An unexpected error occurred.", {
        description: (error as Error).message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Solana Devnet Faucet</CardTitle>
        <CardDescription>Request Devnet SOL to your wallet for testing purposes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="recipientAddress">Recipient Wallet Address</Label>
          <Input
            id="recipientAddress"
            placeholder="Enter wallet address"
            value={recipientAddress || defaultAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            disabled={loading}
          />
        </div>
        <Button onClick={handleRequestAirdrop} disabled={loading}>
          {loading ? "Requesting..." : "Request Airdrop (0.1 SOL)"}
        </Button>
        {defaultAddress && (
          <p className="text-sm text-muted-foreground">Your embedded wallet address: {defaultAddress}</p>
        )}
      </CardContent>
    </Card>
  )
}
