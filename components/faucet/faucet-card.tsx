"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { formatAddress } from "@/app/lib/format/address"
import { FAUCET_PRIVATE_KEY } from "@/app/lib/config"

export function FaucetCard() {
  const { publicKey } = useWallet()
  const [recipientAddress, setRecipientAddress] = useState<string>(publicKey?.toBase58() || "")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleRequestSol = async () => {
    if (!recipientAddress) {
      toast({
        title: "Error",
        description: "Please enter a recipient address.",
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
        body: JSON.stringify({ recipientAddress }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success!",
          description: `0.1 SOL sent to ${formatAddress(recipientAddress)}. Transaction: ${data.signature}`,
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send SOL.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Faucet request failed:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Devnet SOL Faucet</CardTitle>
        <CardDescription>Get free Devnet SOL for testing purposes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="recipient-address" className="block text-sm font-medium text-muted-foreground">
            Recipient Address
          </label>
          <Input
            id="recipient-address"
            type="text"
            placeholder="Enter Solana address"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className="mt-1"
          />
        </div>
        <Button onClick={handleRequestSol} disabled={loading || !recipientAddress} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending SOL...
            </>
          ) : (
            "Request 0.1 SOL"
          )}
        </Button>
        {!FAUCET_PRIVATE_KEY && (
          <p className="text-sm text-red-500">
            Warning: `FAUCET_PRIVATE_KEY` environment variable is not set. Faucet will not work.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
