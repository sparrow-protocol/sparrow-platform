import type { Token } from "@jup-ag/quoted-display-api"
import { getJupiterTokens } from "./jupiter-api"

let jupiterTokens: Token[] = []
let lastFetchTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function fetchAndCacheJupiterTokens(): Promise<Token[]> {
  const now = Date.now()
  if (jupiterTokens.length === 0 || now - lastFetchTime > CACHE_DURATION) {
    try {
      const tokens = await getJupiterTokens()
      jupiterTokens = tokens
      lastFetchTime = now
      console.log("Fetched and cached Jupiter tokens.")
    } catch (error) {
      console.error("Error fetching Jupiter tokens:", error)
      // If fetch fails, return existing cache or empty array
      return jupiterTokens.length > 0 ? jupiterTokens : []
    }
  }
  return jupiterTokens
}

export async function getJupiterTokenByMint(mintAddress: string): Promise<Token | undefined> {
  const tokens = await fetchAndCacheJupiterTokens()
  return tokens.find((token) => token.address === mintAddress)
}

export async function getAllJupiterTokens(): Promise<Token[]> {
  return fetchAndCacheJupiterTokens()
}
