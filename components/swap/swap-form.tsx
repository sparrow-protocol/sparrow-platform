"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { usePrivy } from "@privy-io/react-auth"
import { useWallets } from "@privy-io/react-auth/wallets"
import { PublicKey, Connection } from "@solana/web3.js"
import {
  fetchJupiterTokenList,
  getJupiterQuote,
  getJupiterSwapInstructions,
  sendVersionedTransaction,
} from "@/app/lib/jupiter/jupiter-api"
import type { JupiterToken, QuoteResponse } from "@/app/types/jupiter"
import { CommandMenu } from "@/components/command-menu"
import Image from "next/image"
import { formatNumber } from "@/app/lib/format/number"
import { Loader2 } from "lucide-react"

const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL!)

export function SwapForm() {
  const { user } = usePrivy()
  const { wallets } = useWallets()
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy")
  const publicKey = embeddedWallet ? new PublicKey(embeddedWallet.address) : null

  const [tokens, setTokens] = useState<JupiterToken[]>([])
  const [inputToken, setInputToken] = useState<JupiterToken | null>(null)
  const [outputToken, setOutputToken] = useState<JupiterToken | null>(null)
  const [inputAmount, setInputAmount] = useState<string>("")
  const [quote, setQuote] = useState<QuoteResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetchingQuote, setFetchingQuote] = useState(false)

  useEffect(() => {
    const loadTokens = async () => {
      const fetchedTokens = await fetchJupiterTokenList()
      setTokens(fetchedTokens)
      // Set default tokens (e.g., SOL and USDC)
      setInputToken(fetchedTokens.find((token) => token.symbol === "SOL") || null)
      setOutputToken(fetchedTokens.find((token) => token.symbol === "USDC") || null)
    }
    loadTokens()
  }, [])

  useEffect(() => {
    const fetchQuote = async () => {
      if (inputToken && outputToken && inputAmount && Number.parseFloat(inputAmount) > 0 && publicKey) {
        setFetchingQuote(true)
        const amountInLamports = Math.floor(Number.parseFloat(inputAmount) * 10 ** inputToken.decimals)
        const fetchedQuote = await getJupiterQuote(inputToken.address, outputToken.address, amountInLamports)
        setQuote(fetchedQuote)
        setFetchingQuote(false)
      } else {
        setQuote(null)
      }
    }
    const handler = setTimeout(() => {
      fetchQuote()
    }, 500) // Debounce fetching quote
    return () => clearTimeout(handler)
  }, [inputToken, outputToken, inputAmount, publicKey])

  const handleSwap = async () => {
    if (!publicKey || !embeddedWallet) {
      toast.error("Please connect your wallet.")
      return
    }
    if (!quote) {
      toast.error("No quote available. Please check your input and selected tokens.")
      return
    }

    setLoading(true)
    try {
      const { swapInstruction } = await getJupiterSwapInstructions(quote, publicKey)

      if (!swapInstruction) {
        toast.error("Failed to get swap instructions.")
        return
      }

      const signature = await sendVersionedTransaction(
        connection,
        embeddedWallet,
        swapInstruction.serializedTransaction,
      )

      if (signature) {
        toast.success("Swap successful!", {
          description: `Transaction Signature: ${signature}`,
        })
        setInputAmount("")
        setQuote(null)
      } else {
        toast.error("Swap failed.")
      }
    } catch (error) {
      console.error("Error performing swap:", error)
      toast.error("An unexpected error occurred during swap.", {
        description: (error as Error).message,
      })
    } finally {
      setLoading(false)
    }
  }

  const estimatedOutputAmount = useMemo(() => {
    if (!quote || !outputToken) return "0"
    return (Number.parseInt(quote.outAmount) / 10 ** outputToken.decimals).toFixed(outputToken.decimals)
  }, [quote, outputToken])

  const estimatedFee = useMemo(() => {
    if (!quote) return "0"
    // Jupiter quote provides fees in lamports, convert to SOL
    return (Number.parseInt(quote.totalFees) / 10 ** 9).toFixed(6) // SOL has 9 decimals
  }, [quote])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Token Swap</CardTitle>
        <CardDescription>Exchange tokens on Solana with the best rates.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="inputAmount">You pay</Label>
            <div className="flex items-center gap-2">
              <Input
                id="inputAmount"
                type="number"
                placeholder="0.00"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
                disabled={loading}
                min="0"
                step="any"
              />
              <CommandMenu tokens={tokens} onSelectToken={setInputToken} className="w-32">
                {inputToken ? (
                  <div className="flex items-center gap-2">
                    {inputToken.logoURI && (
                      <Image
                        src={inputToken.logoURI || "/placeholder.svg"}
                        alt={inputToken.symbol}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                    )}
                    <span>{inputToken.symbol}</span>
                  </div>
                ) : (
                  <span>Select Token</span>
                )}
              </CommandMenu>
            </div>
          </div>

          <div>
            <Label htmlFor="outputAmount">You receive</Label>
            <div className="flex items-center gap-2">
              <Input
                id="outputAmount"
                type="text"
                placeholder="0.00"
                value={fetchingQuote ? "Fetching quote..." : estimatedOutputAmount}
                readOnly
                disabled={true}
              />
              <CommandMenu tokens={tokens} onSelectToken={setOutputToken} className="w-32">
                {outputToken ? (
                  <div className="flex items-center gap-2">
                    {outputToken.logoURI && (
                      <Image
                        src={outputToken.logoURI || "/placeholder.svg"}
                        alt={outputToken.symbol}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                    )}
                    <span>{outputToken.symbol}</span>
                  </div>
                ) : (
                  <span>Select Token</span>
                )}
              </CommandMenu>
            </div>
          </div>
        </div>

        {quote && (
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Minimum Received:</span>
              <span>
                {formatNumber(Number.parseInt(quote.outAmountWithSlippage) / 10 ** (outputToken?.decimals || 0))}{" "}
                {outputToken?.symbol}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Slippage:</span>
              <span>{quote.slippageBps / 100}%</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Fees:</span>
              <span>{estimatedFee} SOL</span>
            </div>
          </div>
        )}

        <Button onClick={handleSwap} disabled={loading || !quote || fetchingQuote} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Swapping...
            </>
          ) : (
            "Swap"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
