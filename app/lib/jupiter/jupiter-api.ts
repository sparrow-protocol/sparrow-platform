import { type Connection, VersionedTransaction, type PublicKey } from "@solana/web3.js"
import type { Wallet } from "@solana/wallet-adapter-react"
import { toast } from "sonner"
import type { JupiterToken, QuoteResponse, SwapInstructionsResponse } from "@/app/types/jupiter"

const JUPITER_API_BASE_URL = "https://quote-api.jup.ag/v6"

export async function fetchAllJupiterTokens(): Promise<JupiterToken[]> {
  try {
    const response = await fetch(`${JUPITER_API_BASE_URL}/tokens`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: JupiterToken[] = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching all Jupiter tokens:", error)
    return []
  }
}

export async function getJupiterQuote(
  inputMint: string,
  outputMint: string,
  amount: number, // amount in lamports (smallest unit)
  slippageBps = 50, // 50 basis points = 0.5%
): Promise<QuoteResponse | null> {
  try {
    const response = await fetch(
      `${JUPITER_API_BASE_URL}/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`,
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: QuoteResponse = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching Jupiter quote:", error)
    return null
  }
}

export async function getJupiterSwapInstructions(
  quoteResponse: QuoteResponse,
  userPublicKey: PublicKey,
): Promise<SwapInstructionsResponse | null> {
  try {
    const response = await fetch(`${JUPITER_API_BASE_URL}/swap-instructions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quoteResponse,
        userPublicKey: userPublicKey.toBase58(),
        wrapUnwrapSOL: true,
      }),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: SwapInstructionsResponse = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching Jupiter swap instructions:", error)
    return null
  }
}

export async function sendVersionedTransaction(
  connection: Connection,
  wallet: Wallet,
  serializedTransaction: string,
): Promise<string | null> {
  try {
    const transactionBuffer = Buffer.from(serializedTransaction, "base64")
    const transaction = VersionedTransaction.deserialize(transactionBuffer)

    const signedTransaction = await wallet.signTransaction(transaction)

    const rawTransaction = signedTransaction.serialize()
    const signature = await connection.sendRawTransaction(rawTransaction, {
      skipPreflight: true,
      maxRetries: 2,
    })

    toast.info("Transaction sent, confirming...", {
      description: `Signature: ${signature}`,
    })

    const latestBlockhash = await connection.getLatestBlockhash()
    await connection.confirmTransaction(
      {
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        signature,
      },
      "confirmed",
    )

    toast.success("Transaction confirmed!", {
      description: `Signature: ${signature}`,
    })

    return signature
  } catch (error) {
    console.error("Error sending versioned transaction:", error)
    toast.error("Transaction failed!", {
      description: (error as Error).message,
    })
    return null
  }
}
