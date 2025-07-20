import type { PublicKey } from "@solana/web3.js"
import type { JupiterQuoteResponse, JupiterToken } from "@/app/types/jupiter"

const JUPITER_API_BASE_URL = "https://quote-api.jup.ag/v6"
const JUPITER_TOKEN_LIST_URL = "https://token.jup.ag/strict"

export async function getJupiterTokens(): Promise<JupiterToken[]> {
  try {
    const response = await fetch(`${JUPITER_API_BASE_URL}/tokens`)
    if (!response.ok) {
      throw new Error(`Failed to fetch Jupiter tokens: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching Jupiter tokens:", error)
    return []
  }
}

export async function getJupiterPrice(mintAddress: string): Promise<number | null> {
  try {
    const response = await fetch(`${JUPITER_API_BASE_URL}/price?ids=${mintAddress}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch Jupiter price: ${response.statusText}`)
    }
    const data = await response.json()
    return data.data?.[mintAddress]?.price || null
  } catch (error) {
    console.error(`Error fetching Jupiter price for ${mintAddress}:`, error)
    return null
  }
}

export async function getJupiterQuote(
  inputMint: string,
  outputMint: string,
  amount: string,
  slippageBps: number,
): Promise<JupiterQuoteResponse | null> {
  try {
    const response = await fetch(
      `${JUPITER_API_BASE_URL}/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`,
    )
    if (!response.ok) {
      const errorData = await response.json()
      console.error("Jupiter quote error:", errorData)
      throw new Error(`Failed to fetch Jupiter quote: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error in getJupiterQuote:", error)
    return null
  }
}

export async function getJupiterSwapInstructions(
  quoteResponse: JupiterQuoteResponse,
  userPublicKey: PublicKey,
  wrapAndUnwrapSol = true,
): Promise<any> {
  try {
    const response = await fetch(`${JUPITER_API_BASE_URL}/swap`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quoteResponse,
        userPublicKey: userPublicKey.toBase58(),
        wrapAndUnwrapSol,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Jupiter swap error:", errorData)
      throw new Error(`Failed to get Jupiter swap transaction: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error in getJupiterSwapTransaction:", error)
    throw error
  }
}

export async function fetchJupiterTokenList(): Promise<JupiterToken[]> {
  try {
    const response = await fetch(JUPITER_TOKEN_LIST_URL)
    if (!response.ok) {
      throw new Error(`Failed to fetch Jupiter token list: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching Jupiter token list:", error)
    return []
  }
}
