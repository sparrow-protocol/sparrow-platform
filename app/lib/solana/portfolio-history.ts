import type { PublicKey } from "@solana/web3.js"
import { MOCK_PORTFOLIO_HISTORY } from "@/app/lib/mock-data"
import type { PortfolioHistoryData } from "@/app/types/wallet"

// Mock historical price data for common tokens (replace with real API calls)
const MOCK_HISTORICAL_PRICES: { [key: string]: { [date: string]: number } } = {
  So11111111111111111111111111111111111111112: {
    // SOL
    "2024-01-01": 100,
    "2024-01-02": 102,
    "2024-01-03": 105,
    "2024-01-04": 103,
    "2024-01-05": 108,
    "2024-01-06": 110,
    "2024-01-07": 112,
    "2024-01-08": 115,
    "2024-01-09": 113,
    "2024-01-10": 118,
    "2024-01-11": 120,
    "2024-01-12": 122,
    "2024-01-13": 125,
    "2024-01-14": 123,
    "2024-01-15": 128,
    "2024-01-16": 130,
    "2024-01-17": 132,
    "2024-01-18": 135,
    "2024-01-19": 133,
    "2024-01-20": 138,
    "2024-01-21": 140,
    "2024-01-22": 142,
    "2024-01-23": 145,
    "2024-01-24": 143,
    "2024-01-25": 148,
    "2024-01-26": 150,
    "2024-01-27": 152,
    "2024-01-28": 155,
    "2024-01-29": 153,
    "2024-01-30": 158,
    "2024-01-31": 160,
  },
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: {
    // USDC
    "2024-01-01": 1.0,
    "2024-01-02": 1.0,
    "2024-01-03": 1.0,
    "2024-01-04": 1.0,
    "2024-01-05": 1.0,
    "2024-01-06": 1.0,
    "2024-01-07": 1.0,
    "2024-01-08": 1.0,
    "2024-01-09": 1.0,
    "2024-01-10": 1.0,
    "2024-01-11": 1.0,
    "2024-01-12": 1.0,
    "2024-01-13": 1.0,
    "2024-01-14": 1.0,
    "2024-01-15": 1.0,
    "2024-01-16": 1.0,
    "2024-01-17": 1.0,
    "2024-01-18": 1.0,
    "2024-01-19": 1.0,
    "2024-01-20": 1.0,
    "2024-01-21": 1.0,
    "2024-01-22": 1.0,
    "2024-01-23": 1.0,
    "2024-01-24": 1.0,
    "2024-01-25": 1.0,
    "2024-01-26": 1.0,
    "2024-01-27": 1.0,
    "2024-01-28": 1.0,
    "2024-01-29": 1.0,
    "2024-01-30": 1.0,
    "2024-01-31": 1.0,
  },
  // Add more mock historical prices for other tokens as needed
}

/**
 * Fetches historical portfolio value.
 * This is currently mock data and should be replaced with real data fetching
 * from a historical data API or a database that tracks portfolio value over time.
 * @returns A promise that resolves to an array of PortfolioHistoryData.
 */
export async function getPortfolioHistory(walletAddress: PublicKey): Promise<PortfolioHistoryData[]> {
  // In a real application, you would fetch this data from a database or a Solana indexer
  // For now, we'll return mock data.
  console.log(`Fetching portfolio history for ${walletAddress.toBase58()}`)
  return MOCK_PORTFOLIO_HISTORY
}
