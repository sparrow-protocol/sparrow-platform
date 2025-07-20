import { HELIUS_RPC_URL } from "@/app/lib/constants"

const HELIUS_API_KEY = HELIUS_RPC_URL.split("api-key=")[1]

export async function getTokenPriceHistory(
  mintAddress: string,
  vsToken = "USD",
  interval: "1d" | "7d" | "30d" | "90d" | "1y" | "max" = "7d",
): Promise<any> {
  try {
    const response = await fetch(`https://api.helius.xyz/v0/token-history?api-key=${HELIUS_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mint: mintAddress,
        vsToken: vsToken,
        interval: interval,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Helius token price history error:", errorData)
      throw new Error(`Failed to fetch token price history: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error in getTokenPriceHistory:", error)
    return null
  }
}

export async function getTokenPrice(mintAddress: string, vsToken = "USD"): Promise<number | null> {
  try {
    const response = await fetch(`https://api.helius.xyz/v0/token-price?api-key=${HELIUS_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mint: mintAddress,
        vsToken: vsToken,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Helius token price error:", errorData)
      return null
    }

    const data = await response.json()
    return data?.price || null
  } catch (error) {
    console.error("Error in getTokenPrice:", error)
    return null
  }
}
