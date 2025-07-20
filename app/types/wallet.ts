import type { PublicKey } from "@solana/web3.js"

export type WalletBalance = {
  token: string
  balance: number
  usdValue: number
}

export type TokenBalance = {
  mintAddress: PublicKey
  balance: number
  usdValue: number
  tokenName: string
  tokenSymbol: string
  icon?: string
  decimals: number
}

export type TokenPriceHistory = {
  time: number // Unix timestamp
  value: number // Price in USD
}

export type PortfolioHistory = {
  date: string // YYYY-MM-DD
  value: number // Total portfolio value in USD
}

export type PortfolioHistoryData = {
  date: string
  value: number
}
