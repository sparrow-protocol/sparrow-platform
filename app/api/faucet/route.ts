import { Connection, PublicKey, Keypair } from "@solana/web3.js"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token"
import { NextResponse } from "next/server"

const FAUCET_PRIVATE_KEY = process.env.FAUCET_PRIVATE_KEY
const HELIUS_RPC_URL = process.env.HELIUS_RPC_URL

if (!FAUCET_PRIVATE_KEY) {
  throw new Error("FAUCET_PRIVATE_KEY is not set in environment variables.")
}
if (!HELIUS_RPC_URL) {
  throw new Error("HELIUS_RPC_URL is not set in environment variables.")
}

const connection = new Connection(HELIUS_RPC_URL, "confirmed")
const faucetKeypair = Keypair.fromSecretKey(
  Uint8Array.from(Buffer.from(FAUCET_PRIVATE_KEY, "base58")), // Use base58 for Solana private keys
)

export async function POST(req: Request) {
  try {
    const { recipientAddress, mintAddress, amount } = await req.json()

    if (!recipientAddress || !mintAddress || !amount) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const recipientPublicKey = new PublicKey(recipientAddress)
    const mintPublicKey = new PublicKey(mintAddress)
    const tokenAmount = Number.parseFloat(amount)

    // Get or create the associated token account for the recipient
    const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      faucetKeypair, // Payer
      mintPublicKey,
      recipientPublicKey,
    )

    // Get or create the associated token account for the faucet
    const faucetTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      faucetKeypair, // Payer
      mintPublicKey,
      faucetKeypair.publicKey,
    )

    // Transfer tokens
    const signature = await transfer(
      connection,
      faucetKeypair, // Payer
      faucetTokenAccount.address,
      recipientTokenAccount.address,
      faucetKeypair.publicKey, // Authority
      tokenAmount * Math.pow(10, recipientTokenAccount.mint.decimals), // Amount in smallest unit
    )

    return NextResponse.json({ signature })
  } catch (error) {
    console.error("Faucet error:", error)
    return NextResponse.json({ error: "Failed to dispense tokens" }, { status: 500 })
  }
}
