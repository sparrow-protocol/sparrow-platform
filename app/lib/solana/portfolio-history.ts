import type { PublicKey } from "@solana/web3.js"
import { MOCK_CHART_DATA } from "@/app/lib/mock-data"
import type { ChartData, ChartPeriod } from "@/app/types/chart"

export async function getPortfolioHistory(publicKey: PublicKey, period: ChartPeriod): Promise<ChartData[]> {
  // In a real application, you would fetch this data from a backend API
  // or a blockchain indexer like Helius.
  // For now, we'll use mock data.
  console.log(`Fetching portfolio history for ${publicKey.toBase58()} for ${period}`)
  return MOCK_CHART_DATA[period] || []
}
