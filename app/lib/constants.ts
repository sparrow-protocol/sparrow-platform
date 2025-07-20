import { PublicKey } from "@solana/web3.js"

export const SITE_NAME = "Sparrow"
export const SITE_DESCRIPTION = "A Solana wallet and transaction explorer."

export const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com"
export const SOLANA_NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet"
export const SOLANA_EXPLORER_URL = process.env.NEXT_PUBLIC_SOLANA_EXPLORER_URL || "https://explorer.solana.com"

export const ADMIN_WALLET_ADDRESS = process.env.ADMIN_WALLET_ADDRESS
  ? new PublicKey(process.env.ADMIN_WALLET_ADDRESS)
  : new PublicKey("YOUR_ADMIN_WALLET_PUBLIC_KEY") // Replace with a default or throw error

export const SOLANA_PAY_RECIPIENT_ADDRESS = process.env.SOLANA_PAY_RECIPIENT_ADDRESS
  ? new PublicKey(process.env.SOLANA_PAY_RECIPIENT_ADDRESS)
  : new PublicKey("YOUR_SOLANA_PAY_RECIPIENT_PUBLIC_KEY") // Replace with a default or throw error

// Faucet Private Key (Base58 encoded) - ONLY FOR DEVNET/TESTING
// IMPORTANT: DO NOT USE A MAINNET PRIVATE KEY HERE
export const FAUCET_PRIVATE_KEY = process.env.FAUCET_PRIVATE_KEY || ""
