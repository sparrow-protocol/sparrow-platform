import type { SolanaToken } from "@/app/types/solana"

const COINGECKO_API_BASE_URL = "https://api.coingecko.com/api/v3"

export async function fetchTokenPrice(token: SolanaToken, currency = "usd"): Promise<number | null> {
  if (!token.extensions?.coingeckoId) {
    console.warn(`No CoinGecko ID found for token: ${token.symbol}`)
    return null
  }

  try {
    const response = await fetch(
      `${COINGECKO_API_BASE_URL}/simple/price?ids=${token.extensions.coingeckoId}&vs_currencies=${currency}`,
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return data[token.extensions.coingeckoId]?.[currency] || null
  } catch (error) {
    console.error(`Error fetching price for ${token.symbol}:`, error)
    return null
  }
}

export async function getMarketData(
  tokenSymbol: string,
  currency: string,
): Promise<{ price: number; priceChange24h: number } | null> {
  console.log(`Fetching market data for ${tokenSymbol} in ${currency}`)
  return {
    price: 150, // Example price
    priceChange24h: 5.2, // Example 24h price change
  }
}
