import type { JupiterToken } from "@/app/types/jupiter"

export async function fetchJupiterTokenList(): Promise<JupiterToken[]> {
  try {
    const response = await fetch("https://token.jup.ag/all")
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: JupiterToken[] = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching Jupiter tokens:", error)
    return []
  }
}
