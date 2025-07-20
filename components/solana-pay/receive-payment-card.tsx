"use client"

import { useState, useEffect, useMemo } from "react"
import { PublicKey } from "@solana/web3.js"
import { useWallet } from "@solana/wallet-adapter-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { generateSolanaPayQR, generateSolanaPayUrl, verifySolanaPayTransaction } from "@/app/lib/solana/solana-pay-url"
import BigNumber from "bignumber.js"
import { toast } from "@/components/ui/use-toast"
import { useEmbeddedWallet } from "@/app/hooks/use-embedded-wallet"
import { Loader2 } from "lucide-react"
import { formatAddress } from "@/app/utils/format-address" // Declare the variable before using it

const RECIPIENT_ADDRESS = process.env.SOLANA_PAY_RECIPIENT_ADDRESS
const USDC_MINT_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapTVGSSmpPackCwEKnM" // USDC on mainnet-beta, adjust for devnet if needed

export function ReceivePaymentCard() {
  const { publicKey: solanaPublicKey } = useWallet()
  const { embeddedWalletAddress } = useEmbeddedWallet()

  const recipientAddress = useMemo(() => {
    if (RECIPIENT_ADDRESS) return new PublicKey(RECIPIENT_ADDRESS)
    if (embeddedWalletAddress) return new PublicKey(embeddedWalletAddress)
    if (solanaPublicKey) return solanaPublicKey
    return null
  }, [embeddedWalletAddress, solanaPublicKey])

  const [amount, setAmount] = useState("0.01")
  const [qrSvg, setQrSvg] = useState("")
  const [loading, setLoading] = useState(false)
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null)
  const [reference, setReference] = useState<PublicKey | null>(null)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (recipientAddress && amount && Number.parseFloat(amount) > 0) {
      const newReference = new PublicKey(PublicKey.unique().toBuffer()) // Generate a new unique reference
      setReference(newReference)

      const url = generateSolanaPayUrl({
        recipient: recipientAddress,
        amount: new BigNumber(amount),
        splToken: new PublicKey(USDC_MINT_ADDRESS), // Example: USDC
        reference: newReference,
        label: "Sparrow Payment",
        message: `Payment for ${amount} USDC`,
      })
      setQrSvg(generateSolanaPayQR(url))
      setTransactionSignature(null) // Reset signature on new QR

      // Clear any existing interval
      if (intervalId) {
        clearInterval(intervalId)
      }

      // Start polling for transaction
      const id = setInterval(async () => {
        try {
          const sig = await verifySolanaPayTransaction(
            newReference,
            new BigNumber(amount),
            recipientAddress,
            new PublicKey(USDC_MINT_ADDRESS),
          )
          setTransactionSignature(sig)
          toast({
            title: "Payment Received!",
            description: `Transaction: ${sig}`,
          })
          if (intervalId) clearInterval(intervalId) // Stop polling on success
        } catch (error) {
          // console.log("Waiting for transaction...", error);
        }
      }, 3000) // Poll every 3 seconds
      setIntervalId(id)
    } else {
      setQrSvg("")
      setTransactionSignature(null)
      if (intervalId) clearInterval(intervalId)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [recipientAddress, amount]) // Re-generate QR and restart polling if these change

  if (!recipientAddress) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Receive Payment</CardTitle>
          <CardDescription>Please connect your Solana wallet or log in to generate a payment request.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No recipient address available.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Receive Payment (Solana Pay)</CardTitle>
        <CardDescription>Generate a Solana Pay QR code to receive USDC.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="amount">Amount (USDC)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.000001"
            step="any"
            className="mt-1"
          />
        </div>
        {qrSvg ? (
          <div className="flex flex-col items-center space-y-4">
            <div dangerouslySetInnerHTML={{ __html: qrSvg }} className="h-64 w-64 rounded-lg border p-2" />
            {transactionSignature ? (
              <p className="text-green-500">Payment received! Signature: {formatAddress(transactionSignature)}</p>
            ) : (
              <p className="text-muted-foreground">Scan QR to pay {amount} USDC</p>
            )}
            {reference && (
              <p className="text-xs text-muted-foreground">Reference: {formatAddress(reference.toBase58())}</p>
            )}
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-lg border bg-muted">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
