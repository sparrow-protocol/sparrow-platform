import type { QuoteResponse, SwapResponse, Token } from "@jup-ag/quoted-display-api"

const JUPITER_API_BASE_URL = "https://quote-api.jup.ag/v6"

export async function getJupiterTokens(): Promise<Token[]> {
  const response = await fetch(`${JUPITER_API_BASE_URL}/tokens`)
  if (!response.ok) {
    throw new Error(`Failed to fetch Jupiter tokens: ${response.statusText}`)
  }
  return response.json()
}

export async function getJupiterQuote(
  inputMint: string,
  outputMint: string,
  amount: string, // amount in lamports (smallest unit)
  slippageBps = 50, // 50 basis points = 0.5%
): Promise<QuoteResponse | null> {
  const url = new URL(`${JUPITER_API_BASE_URL}/quote`)
  url.searchParams.append("inputMint", inputMint)
  url.searchParams.append("outputMint", outputMint)
  url.searchParams.append("amount", amount)
  url.searchParams.append("slippageBps", slippageBps.toString())
  url.searchParams.append("onlyDirectRoutes", "false") // Allow indirect routes for better liquidity

  const response = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error("Jupiter quote error:", errorData)
    return null
  }

  const quote: QuoteResponse = await response.json()
  return quote
}

export async function getJupiterSwapTransaction(
  quote: QuoteResponse,
  userPublicKey: string,
  wrapAndUnwrapSol = true,
  feeAccount?: string, // Optional: for referral fees
): Promise<SwapResponse | null> {
  const url = `${JUPITER_API_BASE_URL}/swap`
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      quoteResponse: quote,
      userPublicKey,
      wrapAndUnwrapSol,
      feeAccount,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error("Jupiter swap error:", errorData)
    return null
  }

  const swapResponse: SwapResponse = await response.json()
  return swapResponse
}

export async function getJupiterPrice(mintAddress: string): Promise<number | null> {
  try {
    const response = await fetch(`https://price.jup.ag/v4/price?ids=${mintAddress}`)
    if (!response.ok) {
      console.error(`Failed to fetch Jupiter price for ${mintAddress}: ${response.statusText}`)
      return null
    }
    const data = await response.json()
    if (data.data && data.data[mintAddress]) {
      return data.data[mintAddress].price
    }
    return null
  } catch (error) {
    console.error(`Error fetching Jupiter price for ${mintAddress}:`, error)
    return null
  }
}
