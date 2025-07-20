"use client"

import { useState, useMemo } from "react"
import { PublicKey, type Transaction, VersionedTransaction } from "@solana/web3.js"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { transferSPLToken, sendVersionedTransaction } from "@/app/lib/defi-api"
import { useEmbeddedWallet } from "@/app/hooks/use-embedded-wallet"
import { Loader2 } from "lucide-react"

export function SendPaymentForm() {
  const { connection } = useConnection()
  const { publicKey: solanaPublicKey, signTransaction } = useWallet()
  const { embeddedWallet, embeddedWalletAddress } = useEmbeddedWallet()

  const userPublicKey = useMemo(() => {
    if (embeddedWalletAddress) return new PublicKey(embeddedWalletAddress)
    if (solanaPublicKey) return solanaPublicKey
    return null
  }, [embeddedWalletAddress, solanaPublicKey])

  const [recipientAddress, setRecipientAddress] = useState("")
  const [mintAddress, setMintAddress] = useState("So11111111111111111111111111111111111111112") // Default to SOL
  const [amount, setAmount] = useState("0.01")
  const [decimals, setDecimals] = useState(9) // Default for SOL
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!userPublicKey) {
      toast({
        title: "Error",
        description: "Please connect your wallet or log in to send payments.",
        variant: "destructive",
      })
      return
    }

    if (!recipientAddress || !amount || !mintAddress) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const recipientPublicKey = new PublicKey(recipientAddress)
      const tokenMintPublicKey = new PublicKey(mintAddress)
      const transferAmount = Number.parseFloat(amount)

      const transaction = await transferSPLToken(
        userPublicKey,
        recipientPublicKey,
        tokenMintPublicKey,
        transferAmount,
        decimals,
      )

      const blockhash = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash.blockhash
      transaction.feePayer = userPublicKey

      let signedTransaction: Transaction

      if (embeddedWallet) {
        // Sign with Privy embedded wallet
        const messageV0 = transaction.compileMessage()
        const versionedTransaction = new VersionedTransaction(messageV0)
        signedTransaction = await embeddedWallet.signTransaction(versionedTransaction)
      } else if (signTransaction) {
        // Sign with external Solana wallet adapter
        signedTransaction = await signTransaction(transaction)
      } else {
        throw new Error("No signing method available.")
      }

      const txid = await sendVersionedTransaction(signedTransaction)

      toast({
        title: "Payment Sent!",
        description: `Transaction ID: ${txid}`,
      })
      setRecipientAddress("")
      setAmount("0.01")
    } catch (error) {
      console.error("Send payment error:", error)
      toast({
        title: "Error",
        description: "Failed to send payment. Please check the address and amount.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Send Payment</CardTitle>
        <CardDescription>Send tokens to any Solana address.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="recipient-address">Recipient Address</Label>
          <Input
            id="recipient-address"
            placeholder="Enter recipient's Solana address"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="mint-address">Token Mint Address</Label>
          <Input
            id="mint-address"
            placeholder="e.g., So1111... (SOL)"
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
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="any"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="decimals">Token Decimals</Label>
          <Input
            id="decimals"
            type="number"
            value={decimals}
            onChange={(e) => setDecimals(Number.parseInt(e.target.value))}
            min="0"
            step="1"
            className="mt-1"
          />
        </div>
        <Button onClick={handleSend} disabled={loading || !userPublicKey} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
            </>
          ) : (
            "Send Payment"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
