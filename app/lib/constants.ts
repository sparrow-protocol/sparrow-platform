import { PublicKey } from "@solana/web3.js"

export const SITE_NAME = "Sparrow Web App"
export const SITE_DESCRIPTION = "A modern web application for Solana DeFi."
export const SITE_URL = "https://sparrow-web-app.vercel.app" // Replace with your actual URL

// Solana Network Configuration
export const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com"
export const HELIUS_RPC_URL =
  process.env.NEXT_PUBLIC_HELIUS_RPC_URL || "https://rpc-devnet.helius.xyz/?api-key=YOUR_HELIUS_API_KEY" // Replace with your Helius RPC URL

export const SOLANA_EXPLORER_URL = "https://solana.fm" // Or "https://solscan.io"

// Solana Program IDs
export const SPL_TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5mW")

// Solana Pay Configuration
export const SOLANA_PAY_RECIPIENT_ADDRESS = new PublicKey(
  process.env.SOLANA_PAY_RECIPIENT_ADDRESS || "83g2222222222222222222222222222222222222222222222222222222222222", // Placeholder: Replace with your actual recipient address
)

// Admin Wallet Address (for specific functionalities, e.g., fee collection)
export const ADMIN_WALLET_ADDRESS = new PublicKey(
  process.env.ADMIN_WALLET_ADDRESS || "83g2222222222222222222222222222222222222222222222222222222222222", // Placeholder: Replace with your actual admin address
)

// Privy Configuration
export const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "" // Replace with your Privy App ID

// AI Configuration
export const GROQ_API_KEY = process.env.GROQ_API_KEY || ""
export const XAI_API_KEY = process.env.XAI_API_KEY || ""

// Default Token List URL (e.g., from Jupiter or Solana Labs)
export const DEFAULT_TOKEN_LIST_URL = "https://token.jup.ag/all" // Jupiter's comprehensive token list
// "https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json" // Solana Labs official list

// UI Configuration
export const MAX_TRANSACTION_HISTORY_ITEMS = 10
export const MAX_TOKEN_BALANCES_DISPLAY = 10
