"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { PublicKey } from "@solana/web3.js"
import { useWallet } from "@solana/wallet-adapter-react"
import { useConnection } from "@solana/wallet-adapter-react"
import { Transaction, SystemProgram } from "@solana/web3.js"
import { parseUnits } from "viem"

export function SendPaymentForm() {
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()

  const handleSendPayment = async () => {
    if (!publicKey) {
      toast.error("Please connect your wallet.")
      return
    }
    if (!recipient || !amount) {
      toast.error("Please enter recipient address and amount.")
      return
    }

    setLoading(true)
    try {
      const recipientPublicKey = new PublicKey(recipient)
      const lamports = parseUnits(amount, 9) // SOL has 9 decimals

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPublicKey,
          lamports: BigInt(lamports.toString()),
        }),
      )

      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = publicKey

      const signature = await sendTransaction(transaction, connection)

      toast.info("Transaction sent, confirming...", {
        description: `Signature: ${signature}`,
      })

      await connection.confirmTransaction(signature, "confirmed")

      toast.success("Payment sent successfully!", {
        description: `Transaction Signature: ${signature}`,
      })
      setRecipient("")
      setAmount("")
    } catch (error) {
      console.error("Error sending payment:", error)
      toast.error("Failed to send payment.", {
        description: (error as Error).message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Send Solana Payment</CardTitle>
        <CardDescription>Send SOL to any Solana address.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="recipient">Recipient Address</Label>
          <Input
            id="recipient"
            placeholder="Enter recipient wallet address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <Label htmlFor="amount">Amount (SOL)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
            min="0"
            step="any"
          />
        </div>
        <Button onClick={handleSendPayment} disabled={loading}>
          {loading ? "Sending..." : "Send Payment"}
        </Button>
      </CardContent>
    </Card>
  )
}
