import { BIRDEYE_API_KEY } from "@/app/lib/constants"

export async function getMarketData(tokenSymbols: string[]): Promise<any> {
  if (!BIRDEYE_API_KEY) {
    console.warn("BIRDEYE_API_KEY is not set. Skipping market data fetch.")
    return {}
  }

  try {
    const response = await fetch(`https://public-api.birdeye.so/public/multi_price?tokens=${tokenSymbols.join(",")}`, {
      headers: {
        "X-API-KEY": BIRDEYE_API_KEY,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Birdeye API error:", errorData)
      throw new Error(`Failed to fetch market data: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data || {}
  } catch (error) {
    console.error("Error in getMarketData:", error)
    return {}
  }
}
