import type { PublicKey, TransactionSignature } from "@solana/web3.js"

export interface SolanaTokenAccount {
  pubkey: PublicKey
  mint: PublicKey
  amount: number // In token units (not raw lamports)
  decimals: number
}

export interface SolanaTransactionDetails {
  signature: TransactionSignature
  blockTime: number // Unix timestamp
  status: "success" | "failed"
  fee: number // In SOL
  // Add more details as needed, e.g., parsed instructions
}
