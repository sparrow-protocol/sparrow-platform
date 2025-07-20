import { Connection, PublicKey } from "@solana/web3.js"
import type { Transaction } from "@/app/types/transactions"
import { MOCK_TRANSACTIONS } from "@/app/lib/mock-data"
import { fetchJupiterTokenList } from "@/app/lib/token-list"
import { getMarketData } from "@/app/lib/market-data"

const solanaConnection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com")

export async function getTransactionHistory(connection: Connection, publicKey: PublicKey): Promise<Transaction[]> {
  // In a real application, you would fetch this data from a blockchain indexer
  // like Helius.
  // For now, we'll use mock data.
  console.log(`Fetching transaction history for ${publicKey.toBase58()}`)
  return MOCK_TRANSACTIONS
}

export async function getTransactionDetails(
  signature: string,
  connection: Connection,
  tokenList: any[],
): Promise<any | null> {
  console.log(`Fetching details for transaction ${signature}... (using mock data for now)`)
  return MOCK_TRANSACTIONS.find((tx) => tx.signature === signature) || null
}

export async function getSolanaTransactionHistory(publicKey: PublicKey): Promise<any[]> {
  try {
    const signatures = await solanaConnection.getConfirmedSignaturesForAddress2(publicKey, { limit: 10 })
    const transactions: any[] = []
    const tokenList = await fetchJupiterTokenList()

    for (const sigInfo of signatures) {
      const tx = await solanaConnection.getParsedTransaction(sigInfo.signature, {
        maxSupportedTransactionVersion: 0,
      })

      if (tx) {
        let type: "transfer" | "swap" | "unknown" = "unknown"
        let source = "N/A"
        let destination = "N/A"
        let amount = 0
        let mint = "N/A"
        let tokenSymbol = "N/A"
        let pricePerToken = 0
        let usdValue = 0

        for (const instruction of tx.transaction.message.instructions) {
          if ("parsed" in instruction) {
            if (instruction.program === "spl-token" && instruction.parsed.type === "transfer") {
              type = "transfer"
              source = instruction.parsed.info.source
              destination = instruction.parsed.info.destination
              mint = instruction.parsed.info.mint
              amount = instruction.parsed.info.amount / 10 ** (tokenList.find((t) => t.address === mint)?.decimals || 0)
              const tokenMeta = tokenList.find((t) => t.address === mint)
              tokenSymbol = tokenMeta?.symbol || "Unknown"
              const marketData = await getMarketData(tokenSymbol)
              pricePerToken = marketData?.price || 0
              usdValue = amount * pricePerToken
              break
            } else if (instruction.program === "system" && instruction.parsed.type === "transfer") {
              type = "transfer"
              source = instruction.parsed.info.source
              destination = instruction.parsed.info.destination
              amount = instruction.parsed.info.lamports / 10 ** 9 // LAMPORTS_PER_SOL is not imported, using 10^9 directly
              tokenSymbol = "SOL"
              mint = new PublicKey("So11111111111111111111111111111111111111112").toBase58()
              const marketData = await getMarketData("SOL")
              pricePerToken = marketData?.price || 0
              usdValue = amount * pricePerToken
              break
            }
          }
        }

        transactions.push({
          signature: sigInfo.signature,
          blockTime: sigInfo.blockTime || Date.now() / 1000,
          fee: tx.meta?.fee ? tx.meta.fee / 10 ** 9 : 0, // LAMPORTS_PER_SOL is not imported, using 10^9 directly
          status: sigInfo.err ? "failed" : "success",
          type,
          source,
          destination,
          amount,
          mint,
          tokenSymbol,
          pricePerToken,
          usdValue,
        })
      }
    }
    return transactions
  } catch (error) {
    console.error("Error fetching transaction history:", error)
    return []
  }
}
