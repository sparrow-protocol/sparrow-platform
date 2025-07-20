"use client"

import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { useEmbeddedWallet } from "@/app/hooks/use-embedded-wallet"

export function FaucetCard() {
  const { publicKey: solanaPublicKey } = useWallet()
  const { embeddedWalletAddress } = useEmbeddedWallet()
  const [mintAddress, setMintAddress] = useState("")
  const [amount, setAmount] = useState("1")
  const [loading, setLoading] = useState(false)

  const recipientAddress = embeddedWalletAddress || solanaPublicKey?.toBase58()

  const handleDispense = async () => {
    if (!recipientAddress) {
      toast({
        title: "Error",
        description: "Please connect a wallet or log in to receive tokens.",
        variant: "destructive",
      })
      return
    }

    if (!mintAddress) {
      toast({
        title: "Error",
        description: "Please enter a token mint address.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/faucet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientAddress,
          mintAddress,
          amount: Number.parseFloat(amount),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: `Tokens dispensed! Transaction: ${data.signature}`,
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to dispense tokens.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Faucet dispense error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Token Faucet (Devnet)</CardTitle>
        <CardDescription>Receive free test tokens on Solana Devnet for development and testing.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="recipient">Recipient Address</Label>
          <Input id="recipient" value={recipientAddress || "Connect wallet or log in..."} readOnly className="mt-1" />
        </div>
        <div>
          <Label htmlFor="mint">Token Mint Address</Label>
          <Input
            id="mint"
            placeholder="e.g., Es9onQ... (USDC devnet)"
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.000001"
            step="any"
            className="mt-1"
          />
        </div>
        <Button onClick={handleDispense} disabled={loading || !recipientAddress}>
          {loading ? "Dispensing..." : "Dispense Tokens"}
        </Button>
      </CardContent>
    </Card>
  )
}
