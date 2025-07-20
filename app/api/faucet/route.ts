import { type NextRequest, NextResponse } from "next/server"
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction } from "@solana/web3.js"
import { FAUCET_PRIVATE_KEY, SOLANA_RPC_URL } from "@/app/lib/constants"
import bs58 from "bs58"

export async function POST(req: NextRequest) {
  if (!FAUCET_PRIVATE_KEY) {
    return NextResponse.json({ error: "Faucet private key not configured" }, { status: 500 })
  }

  try {
    const { recipientAddress } = await req.json()

    if (!recipientAddress) {
      return NextResponse.json({ error: "Recipient address is required" }, { status: 400 })
    }

    const connection = new Connection(SOLANA_RPC_URL, "confirmed")
    const faucetKeypair = Keypair.fromSecretKey(bs58.decode(FAUCET_PRIVATE_KEY))
    const recipientPublicKey = new PublicKey(recipientAddress)

    // Request 0.1 SOL
    const amount = 0.1 * LAMPORTS_PER_SOL

    // Check faucet balance
    const faucetBalance = await connection.getBalance(faucetKeypair.publicKey)
    if (faucetBalance < amount) {
      return NextResponse.json({ error: "Faucet has insufficient SOL" }, { status: 503 })
    }

    const transaction = new Transaction().add(
      await connection.transactionInstruction(faucetKeypair.publicKey, recipientPublicKey, amount),
    )

    const signature = await connection.sendTransaction(transaction, [faucetKeypair])
    await connection.confirmTransaction(signature, "confirmed")

    return NextResponse.json({ success: true, signature })
  } catch (error) {
    console.error("Faucet error:", error)
    return NextResponse.json({ error: "Failed to send SOL from faucet" }, { status: 500 })
  }
}
