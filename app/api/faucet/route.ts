import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { Keypair } from "@solana/web3.js"
import { NextResponse } from "next/server"

const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL!)

export async function POST(req: Request) {
  try {
    const { walletAddress } = await req.json()

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    const recipientPublicKey = new PublicKey(walletAddress)

    // Ensure FAUCET_PRIVATE_KEY is set in your environment variables
    if (!process.env.FAUCET_PRIVATE_KEY) {
      return NextResponse.json({ error: "Faucet private key not configured" }, { status: 500 })
    }

    const faucetKeypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.FAUCET_PRIVATE_KEY)))

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: faucetKeypair.publicKey,
        toPubkey: recipientPublicKey,
        lamports: 0.1 * LAMPORTS_PER_SOL, // Send 0.1 SOL
      }),
    )

    const { blockhash } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = faucetKeypair.publicKey

    transaction.sign(faucetKeypair)

    const signature = await connection.sendRawTransaction(transaction.serialize())

    await connection.confirmTransaction(signature, "confirmed")

    return NextResponse.json({ signature })
  } catch (error) {
    console.error("Faucet error:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
