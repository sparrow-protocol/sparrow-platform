"use client"

import { useState, useEffect, useMemo } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { PublicKey, TransactionMessage, VersionedTransaction } from "@solana/web3.js"
import { ArrowDown, Loader2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import {
  fetchJupiterQuote,
  fetchJupiterSwapInstructions,
  sendVersionedTransaction,
  fetchAllJupiterTokens,
} from "@/app/lib/defi-api"
import type { JupiterToken } from "@/app/types/jupiter"
import { useEmbeddedWallet } from "@/app/hooks/use-embedded-wallet"
import { formatNumber } from "@/app/lib/format/number"

export function SwapForm() {
  const { connection } = useConnection()
  const { publicKey: solanaPublicKey, signTransaction } = useWallet()
  const { embeddedWallet, embeddedWalletAddress } = useEmbeddedWallet()

  const userPublicKey = useMemo(() => {
    if (embeddedWalletAddress) return new PublicKey(embeddedWalletAddress)
    if (solanaPublicKey) return solanaPublicKey
    return null
  }, [embeddedWalletAddress, solanaPublicKey])

  const [inputMint, setInputMint] = useState("So11111111111111111111111111111111111111112") // SOL
  const [outputMint, setOutputMint] = useState("EPjFWdd5AufqSSqeM2qN1xzybapTVGSSmpPackCwEKnM") // USDC
  const [inputAmount, setInputAmount] = useState("0.1")
  const [outputAmount, setOutputAmount] = useState("0")
  const [loading, setLoading] = useState(false)
  const [quote, setQuote] = useState<any>(null)
  const slippageBps = 50 // 0.5% slippage

  const { data: tokens, isLoading: isLoadingTokens } = useQuery<JupiterToken[]>({
    queryKey: ["jupiterTokens"],
    queryFn: fetchAllJupiterTokens, // Use the new API call
    staleTime: 1000 * 60 * 60, // 1 hour
  })

  const inputToken = useMemo(() => tokens?.find((t) => t.address === inputMint), [tokens, inputMint])
  const outputToken = useMemo(() => tokens?.find((t) => t.address === outputMint), [tokens, outputMint])

  useEffect(() => {
    const getQuote = async () => {
      if (inputAmount && Number.parseFloat(inputAmount) > 0 && inputToken && outputToken) {
        setLoading(true)
        try {
          const fetchedQuote = await fetchJupiterQuote(
            inputMint,
            outputMint,
            (Number.parseFloat(inputAmount) * Math.pow(10, inputToken.decimals)).toString(),
            slippageBps,
          )
          setQuote(fetchedQuote)
          if (fetchedQuote) {
            setOutputAmount(
              formatNumber(Number.parseFloat(fetchedQuote.outAmount) / Math.pow(10, outputToken.decimals), 6),
            )
          } else {
            setOutputAmount("0")
          }
        } catch (error) {
          console.error("Error fetching quote:", error)
          setOutputAmount("0")
          toast({
            title: "Error",
            description: "Failed to fetch swap quote. Please try again.",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      } else {
        setQuote(null)
        setOutputAmount("0")
      }
    }
    const handler = setTimeout(() => {
      getQuote()
    }, 500) // Debounce for 500ms
    return () => clearTimeout(handler)
  }, [inputAmount, inputMint, outputMint, inputToken, outputToken, slippageBps])

  const handleSwap = async () => {
    if (!userPublicKey || !quote || !inputToken || !outputToken) {
      toast({
        title: "Error",
        description: "Please connect your wallet, enter amounts, and select tokens.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const { swapInstruction, cleanupInstruction, setupInstructions } = await fetchJupiterSwapInstructions(
        quote,
        userPublicKey,
      )

      const blockhash = await connection.getLatestBlockhash()
      const messageV0 = new TransactionMessage({
        payerKey: userPublicKey,
        recentBlockhash: blockhash.blockhash,
        instructions: [...setupInstructions, swapInstruction, cleanupInstruction].filter(Boolean),
      }).compileToLegacyMessage()

      const transaction = new VersionedTransaction(messageV0)

      let signedTransaction: VersionedTransaction

      if (embeddedWallet) {
        // Sign with Privy embedded wallet
        signedTransaction = await embeddedWallet.signTransaction(transaction)
      } else if (signTransaction) {
        // Sign with external Solana wallet adapter
        signedTransaction = await signTransaction(transaction)
      } else {
        throw new Error("No signing method available.")
      }

      const txid = await sendVersionedTransaction(signedTransaction)

      toast({
        title: "Swap Successful!",
        description: `Transaction ID: ${txid}`,
      })
    } catch (error) {
      console.error("Swap error:", error)
      toast({
        title: "Error",
        description: "Failed to execute swap. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFlipTokens = () => {
    setInputMint(outputMint)
    setOutputMint(inputMint)
    setInputAmount(outputAmount)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Token Swap</CardTitle>
        <CardDescription>Exchange tokens on Solana using Jupiter Aggregator.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="input-amount">You pay</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="input-amount"
              type="number"
              placeholder="0.0"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              min="0"
              step="any"
              className="flex-1"
            />
            <Select value={inputMint} onValueChange={setInputMint} disabled={isLoadingTokens}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingTokens ? (
                  <SelectItem value="loading" disabled>
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
                    </div>
                  </SelectItem>
                ) : (
                  tokens?.map((token) => (
                    <SelectItem key={token.address} value={token.address}>
                      <div className="flex items-center">
                        {token.logoURI && (
                          <img
                            src={token.logoURI || "/placeholder.svg"}
                            alt={token.symbol}
                            className="mr-2 h-5 w-5 rounded-full"
                          />
                        )}
                        {token.symbol}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center">
          <Button variant="outline" size="icon" onClick={handleFlipTokens} className="rounded-full bg-transparent">
            <ArrowDown className="h-4 w-4" />
            <span className="sr-only">Flip tokens</span>
          </Button>
        </div>

        <div>
          <Label htmlFor="output-amount">You receive</Label>
          <div className="flex items-center space-x-2">
            <Input id="output-amount" type="text" value={outputAmount} readOnly className="flex-1" disabled={loading} />
            <Select value={outputMint} onValueChange={setOutputMint} disabled={isLoadingTokens}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingTokens ? (
                  <SelectItem value="loading" disabled>
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
                    </div>
                  </SelectItem>
                ) : (
                  tokens?.map((token) => (
                    <SelectItem key={token.address} value={token.address}>
                      <div className="flex items-center">
                        {token.logoURI && (
                          <img
                            src={token.logoURI || "/placeholder.svg"}
                            alt={token.symbol}
                            className="mr-2 h-5 w-5 rounded-full"
                          />
                        )}
                        {token.symbol}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {quote && (
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              Price Impact:{" "}
              <span className={Number.parseFloat(quote.priceImpactPct) > 0.05 ? "text-destructive" : ""}>
                {(Number.parseFloat(quote.priceImpactPct) * 100).toFixed(2)}%
              </span>
            </p>
            <p>Slippage: {(slippageBps / 100).toFixed(2)}%</p>
            <div className="pt-2 border-t border-border mt-2">
              <p className="font-medium">Transaction Summary:</p>
              <p>
                Minimum Received:{" "}
                {outputToken &&
                  formatNumber(
                    Number.parseFloat(quote.outAmountWithSlippage) / Math.pow(10, outputToken.decimals),
                    6,
                  )}{" "}
                {outputToken?.symbol}
              </p>
              <p>
                Estimated SOL Fee: ~0.000005 SOL{" "}
                <span className="text-xs text-muted-foreground">(network fee estimate)</span>
              </p>
            </div>
          </div>
        )}

        <Button onClick={handleSwap} className="w-full" disabled={loading || !quote || !userPublicKey}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Swapping...
            </>
          ) : (
            "Swap"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
