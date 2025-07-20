"use client"

import { useState, useEffect, useMemo } from "react"
import { Connection, PublicKey } from "@solana/web3.js"
import { useWallet } from "@solana/wallet-adapter-react"
import type { TokenInfo } from "@solana/spl-token-registry"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icons } from "@/components/ui/icons"
import { getJupiterTokens, getJupiterQuote, executeJupiterSwap } from "@/app/lib/jupiter/jupiter-api"
import { formatNumber } from "@/app/lib/format/number"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export function SwapForm() {
  const { publicKey, sendTransaction } = useWallet()
  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [inputToken, setInputToken] = useState<TokenInfo | null>(null)
  const [outputToken, setOutputToken] = useState<TokenInfo | null>(null)
  const [inputAmount, setInputAmount] = useState<string>("")
  const [quote, setQuote] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [swapping, setSwapping] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchTokens = async () => {
      const fetchedTokens = await getJupiterTokens()
      setTokens(fetchedTokens)
      // Set default tokens if available
      if (fetchedTokens.length > 0) {
        setInputToken(fetchedTokens.find((t) => t.symbol === "SOL") || fetchedTokens[0])
        setOutputToken(fetchedTokens.find((t) => t.symbol === "USDC") || fetchedTokens[1])
      }
    }
    fetchTokens()
  }, [])

  const fetchQuote = async () => {
    if (!inputToken || !outputToken || !inputAmount || !publicKey) return

    setLoading(true)
    try {
      const amountInLamports = Math.floor(Number.parseFloat(inputAmount) * 10 ** inputToken.decimals)
      const fetchedQuote = await getJupiterQuote(
        new PublicKey(inputToken.address),
        new PublicKey(outputToken.address),
        amountInLamports,
      )
      setQuote(fetchedQuote)
    } catch (error) {
      console.error("Error fetching quote:", error)
      setQuote(null)
      toast({
        title: "Error fetching quote",
        description: "Could not retrieve a swap quote. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSwap = async () => {
    if (!quote || !publicKey || !sendTransaction) {
      toast({
        title: "Swap Error",
        description: "Missing quote or wallet connection.",
        variant: "destructive",
      })
      return
    }

    setSwapping(true)
    try {
      const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL!)
      const txid = await executeJupiterSwap(quote, { publicKey, sendTransaction, connection })

      if (txid) {
        toast({
          title: "Swap Successful!",
          description: `Transaction ID: ${txid}`,
        })
        setInputAmount("")
        setQuote(null)
      } else {
        toast({
          title: "Swap Failed",
          description: "Could not complete the swap.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error during swap:", error)
      toast({
        title: "Swap Error",
        description: `An error occurred during the swap: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    } finally {
      setSwapping(false)
    }
  }

  const estimatedOutputAmount = useMemo(() => {
    if (!quote || !outputToken) return "0"
    return formatNumber(Number.parseInt(quote.outAmount) / 10 ** outputToken.decimals, outputToken.decimals)
  }, [quote, outputToken])

  const priceImpact = useMemo(() => {
    if (!quote) return "0"
    return (quote.priceImpactPct / 100).toFixed(2)
  }, [quote])

  const minimumReceived = useMemo(() => {
    if (!quote || !outputToken) return "0"
    return formatNumber(Number.parseInt(quote.otherAmountThreshold) / 10 ** outputToken.decimals, outputToken.decimals)
  }, [quote, outputToken])

  const handleInputTokenChange = (address: string) => {
    setInputToken(tokens.find((t) => t.address === address) || null)
    setQuote(null)
  }

  const handleOutputTokenChange = (address: string) => {
    setOutputToken(tokens.find((t) => t.address === address) || null)
    setQuote(null)
  }

  const handleSwitchTokens = () => {
    setInputToken(outputToken)
    setOutputToken(inputToken)
    setInputAmount("")
    setQuote(null)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Swap Tokens</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="input-amount" className="block text-sm font-medium text-muted-foreground">
            You pay
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <Input
              id="input-amount"
              type="number"
              placeholder="0.0"
              value={inputAmount}
              onChange={(e) => {
                setInputAmount(e.target.value)
                setQuote(null)
              }}
              className="flex-1"
            />
            <Select onValueChange={handleInputTokenChange} value={inputToken?.address || ""}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select Token" />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((token) => (
                  <SelectItem key={token.address} value={token.address}>
                    <div className="flex items-center gap-2">
                      {token.logoURI && (
                        <img
                          src={token.logoURI || "/placeholder.svg"}
                          alt={token.symbol}
                          className="h-5 w-5 rounded-full"
                        />
                      )}
                      {token.symbol}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center">
          <Button variant="ghost" size="icon" onClick={handleSwitchTokens}>
            <Icons.arrowRight className="h-5 w-5 rotate-90" />
            <span className="sr-only">Switch tokens</span>
          </Button>
        </div>

        <div>
          <label htmlFor="output-amount" className="block text-sm font-medium text-muted-foreground">
            You receive
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <Input
              id="output-amount"
              type="text"
              readOnly
              value={estimatedOutputAmount}
              placeholder="0.0"
              className="flex-1 bg-muted"
            />
            <Select onValueChange={handleOutputTokenChange} value={outputToken?.address || ""}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select Token" />
              </SelectTrigger>
              <SelectContent>
                {tokens.map((token) => (
                  <SelectItem key={token.address} value={token.address}>
                    <div className="flex items-center gap-2">
                      {token.logoURI && (
                        <img
                          src={token.logoURI || "/placeholder.svg"}
                          alt={token.symbol}
                          className="h-5 w-5 rounded-full"
                        />
                      )}
                      {token.symbol}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {quote && (
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              Estimated Price Impact: <span className="font-medium">{priceImpact}%</span>
            </p>
            <p>
              Minimum Received:{" "}
              <span className="font-medium">
                {minimumReceived} {outputToken?.symbol}
              </span>
            </p>
          </div>
        )}

        <Button
          onClick={fetchQuote}
          disabled={!inputToken || !outputToken || !inputAmount || loading || !publicKey}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Getting Quote...
            </>
          ) : (
            "Get Quote"
          )}
        </Button>

        {quote && (
          <Button onClick={handleSwap} disabled={swapping || !publicKey} className="w-full">
            {swapping ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Swapping...
              </>
            ) : (
              "Swap"
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
