import type { PublicKey } from "@solana/web3.js"

export type SolanaNetwork = "mainnet-beta" | "devnet" | "testnet"

export type TokenInfo = {
  mint: PublicKey
  name: string
  symbol: string
  decimals: number
  logoURI?: string
}

export type SolanaWallet = {
  publicKey: PublicKey
  balance: number // in SOL
}
