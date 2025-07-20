"use client"

import { useState } from "react"
import { PublicKey } from "@solana/web3.js"
import QRCode from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createSolanaPayUrl } from "@/app/lib/solana/solana-pay-url"
import { useToast } from "@/hooks/use-toast"
import { CopyButton } from "@/components/copy-button"

export function SendPaymentForm() {
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [solanaPayUrl, setSolanaPayUrl] = useState<URL | null>(null)
  const { toast } = useToast()

  const handleGenerateUrl = () => {
    try {
      const recipientPk = new PublicKey(recipient)
      const amountNum = Number.parseFloat(amount)

      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error("Invalid amount")
      }

      const url = createSolanaPayUrl({
        recipient: recipientPk,
        amount: amountNum,
        message: "Sparrow Web App Payment",
      })
      setSolanaPayUrl(url)
      toast({
        title: "Solana Pay URL Generated",
        description: "Scan the QR code or copy the URL.",
      })
    } catch (error: any) {
      toast({
        title: "Error generating URL",
        description: error.message || "Please check recipient address and amount.",
        variant: "destructive",
      })
      setSolanaPayUrl(null)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Send Solana Pay</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="recipient">Recipient Address</Label>
          <Input
            id="recipient"
            placeholder="Enter Solana address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="amount">Amount (SOL)</Label>
          <Input
            id="amount"
            type="number"
            step="any"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <Button onClick={handleGenerateUrl} className="w-full">
          Generate Payment QR
        </Button>

        {solanaPayUrl && (
          <div className="flex flex-col items-center space-y-4 mt-4">
            <div className="p-2 border rounded-lg">
              <QRCode value={solanaPayUrl.toString()} size={256} level="H" />
            </div>
            <div className="flex items-center space-x-2 w-full">
              <Input readOnly value={solanaPayUrl.toString()} className="flex-grow" />
              <CopyButton value={solanaPayUrl.toString()} />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Scan this QR code with a Solana wallet app to send payment.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
