import type { PublicKey } from "@solana/web3.js"

export type SolanaToken = {
  address: string
  chainId: number
  decimals: number
  name: string
  symbol: string
  logoURI: string
  tags: string[]
}

export type SolanaWalletBalance = {
  mint: PublicKey
  tokenSymbol: string
  balance: number
  usdValue: number
  pricePerToken: number
  logoURI?: string
}

export type SolanaTransaction = {
  signature: string
  blockTime: number
  fee: number
  status: "success" | "failed"
  type: "transfer" | "swap" | "unknown"
  source: string
  destination: string
  amount: number
  mint: string
  tokenSymbol: string
  pricePerToken: number
  usdValue: number
}

export type TokenInfo = {
  address: string
  chainId: number
  decimals: number
  name: string
  symbol: string
  logoURI: string
  tags: string[]
}
