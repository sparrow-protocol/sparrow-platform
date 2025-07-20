import { HELIUS_API_KEY } from "@/app/lib/constants"
import { Connection, type PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js"
import {
  getJupiterPrice,
  getJupiterQuote,
  getJupiterSwapInstructions,
  fetchJupiterTokenList,
} from "@/app/lib/jupiter/jupiter-api"
import { getWalletBalances } from "@/app/lib/solana/wallet-balances"
import { getPortfolioHistory } from "@/app/lib/solana/portfolio-history"
import { getMarketData } from "@/app/lib/market-data"
import type { TokenBalance, PortfolioHistoryData } from "@/app/types/wallet"
import type { TransactionDetails, TransactionType } from "@/app/types/transactions"
import { getUserTransactions, getTransactionDetails } from "@/db/queries"
import { formatTimestamp } from "@/app/lib/format/date"
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync, createTransferInstruction } from "@solana/spl-token"
import type { JupiterToken } from "@/app/types/jupiter"

const HELIUS_RPC_URL = process.env.HELIUS_RPC_URL || ""
const connection = new Connection(HELIUS_RPC_URL, "confirmed")

export async function getTokenPriceHistory(
  mintAddress: string,
  vsToken = "USD",
  interval: "1d" | "7d" | "30d" | "90d" | "1y" | "max" = "7d",
): Promise<any> {
  try {
    const response = await fetch(`https://api.helius.xyz/v0/token-history?api-key=${HELIUS_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mint: mintAddress,
        vsToken: vsToken,
        interval: interval,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Helius token price history error:", errorData)
      throw new Error(`Failed to fetch token price history: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error in getTokenPriceHistory:", error)
    return null
  }
}

export async function getTokenPrice(mintAddress: string, vsToken = "USD"): Promise<number | null> {
  try {
    const response = await fetch(`https://api.helius.xyz/v0/token-price?api-key=${HELIUS_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mint: mintAddress,
        vsToken: vsToken,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Helius token price error:", errorData)
      return null
    }

    const data = await response.json()
    return data?.price || null
  } catch (error) {
    console.error("Error in getTokenPrice:", error)
    return null
  }
}

export async function fetchWalletData(walletAddress: PublicKey): Promise<{
  balances: TokenBalance[]
  portfolioHistory: PortfolioHistoryData[]
}> {
  const balances = await getWalletBalances(connection, walletAddress)
  const portfolioHistory = await getPortfolioHistory(walletAddress) // Mock data for now
  return { balances, portfolioHistory }
}

export async function fetchRecentTransactions(
  userId: string,
  page: number,
  searchQuery: string,
  transactionType: TransactionType | "all",
): Promise<{ transactions: TransactionDetails[]; totalPages: number }> {
  // In a real app, you'd fetch transactions from your database or a Solana indexer
  // For now, we'll use the mock data and apply filters
  const { transactions, totalPages } = await getUserTransactions(userId, page, 10, searchQuery, transactionType)
  return { transactions, totalPages }
}

export async function fetchTransactionDetails(signature: string): Promise<TransactionDetails | undefined> {
  return await getTransactionDetails(signature)
}

export async function fetchTokenPrice(mintAddress: string): Promise<number | null> {
  return getJupiterPrice(mintAddress)
}

export async function getRecentTransactions(walletAddress: PublicKey, limit = 10): Promise<TransactionDetails[]> {
  try {
    const signatures = await connection.getConfirmedSignaturesForAddress2(walletAddress, { limit })

    const transactions = await Promise.all(
      signatures.map(async (sigInfo) => {
        const tx = await connection.getParsedTransaction(sigInfo.signature, {
          maxSupportedTransactionVersion: 0,
          commitment: "confirmed",
        })

        if (!tx) return null

        const type: TransactionType = tx.transaction.message.instructions.some(
          (ix) => "parsed" in ix && ix.parsed?.type === "transfer",
        )
          ? "transfer"
          : "program_interaction" // Simplified type for now

        return {
          signature: sigInfo.signature,
          timestamp: formatTimestamp(sigInfo.blockTime ? sigInfo.blockTime * 1000 : Date.now()),
          type: type,
          status: sigInfo.err ? "failed" : "success",
          fee: tx.meta?.fee ? tx.meta.fee / 1_000_000_000 : 0, // Convert lamports to SOL
          block: tx.slot,
          // Add more details as needed
        } as TransactionDetails
      }),
    )

    return transactions.filter(Boolean) as TransactionDetails[]
  } catch (error) {
    console.error("Error fetching recent transactions:", error)
    return []
  }
}

export async function getTransactionDetailsBySignature(signature: string): Promise<TransactionDetails | null> {
  try {
    const tx = await connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
      commitment: "confirmed",
    })

    if (!tx) {
      return null
    }

    const type: TransactionType = tx.transaction.message.instructions.some(
      (ix) => "parsed" in ix && ix.parsed?.type === "transfer",
    )
      ? "transfer"
      : "program_interaction"

    const parsedInstructions = tx.transaction.message.instructions.map((ix, index) => {
      if ("parsed" in ix) {
        return {
          programId: ix.programId.toBase58(),
          program: ix.program,
          type: ix.parsed?.type || "unknown",
          info: ix.parsed?.info || {},
        }
      } else {
        return {
          programId: ix.programId.toBase58(),
          data: ix.data,
          accounts: ix.accounts.map((acc) => acc.toBase58()),
        }
      }
    })

    return {
      signature: signature,
      timestamp: formatTimestamp(tx.blockTime ? tx.blockTime * 1000 : Date.now()),
      type: type,
      status: tx.meta?.err ? "failed" : "success",
      fee: tx.meta?.fee ? tx.meta.fee / 1_000_000_000 : 0,
      block: tx.slot,
      slot: tx.slot,
      recentBlockhash: tx.transaction.message.recentBlockhash,
      instructions: parsedInstructions,
      // Log messages from transaction meta
      logMessages: tx.meta?.logMessages || [],
      // Account keys involved in the transaction
      accountKeys: tx.transaction.message.staticAccountKeys.map((key) => key.toBase58()),
      // Pre and post balances
      preBalances: tx.meta?.preBalances || [],
      postBalances: tx.meta?.postBalances || [],
      // Pre and post token balances
      preTokenBalances: tx.meta?.preTokenBalances || [],
      postTokenBalances: tx.meta?.postTokenBalances || [],
    }
  } catch (error) {
    console.error(`Error fetching transaction details for ${signature}:`, error)
    return null
  }
}

/**
 * Fetches transaction history for a given wallet address.
 * This function is a placeholder and should be replaced with a more robust solution
 * that integrates with a database or a specialized API for historical transactions.
 * For now, it fetches recent transactions directly from the Solana RPC.
 * @param walletAddress The public key of the wallet.
 * @param page The page number for pagination.
 * @param limit The number of transactions per page.
 * @param query Optional search query for signature.
 * @param type Optional filter for transaction type.
 * @returns An object containing transactions and total pages.
 */
export async function getTransactionHistory(
  walletAddress: PublicKey,
  page = 1,
  limit = 10,
  query = "",
  type: TransactionType | "all" = "all",
) {
  try {
    // In a real application, you would query your database here
    // For now, we'll simulate pagination by fetching more recent transactions
    // and then filtering/slicing them. This is NOT efficient for large histories.
    const allSignatures = await connection.getConfirmedSignaturesForAddress2(walletAddress, {
      limit: 100, // Fetch a larger set to simulate filtering
    })

    const filteredSignatures = allSignatures.filter((sigInfo) => {
      const matchesQuery = query ? sigInfo.signature.includes(query) : true
      // Type filtering would require parsing transaction details, which is expensive here.
      // For a real app, store type in DB or use a specialized API.
      const matchesType = type === "all" ? true : true // Placeholder, actual type check needed

      return matchesQuery && matchesType
    })

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const signaturesForPage = filteredSignatures.slice(startIndex, endIndex)

    const transactions = await Promise.all(
      signaturesForPage.map(async (sigInfo) => {
        const tx = await connection.getParsedTransaction(sigInfo.signature, {
          maxSupportedTransactionVersion: 0,
          commitment: "confirmed",
        })

        if (!tx) return null

        const txType: TransactionType = tx.transaction.message.instructions.some(
          (ix) => "parsed" in ix && ix.parsed?.type === "transfer",
        )
          ? "transfer"
          : "program_interaction"

        return {
          signature: sigInfo.signature,
          timestamp: formatTimestamp(sigInfo.blockTime ? sigInfo.blockTime * 1000 : Date.now()),
          type: txType,
          status: sigInfo.err ? "failed" : "success",
          fee: tx.meta?.fee ? tx.meta.fee / 1_000_000_000 : 0,
          block: tx.slot,
        } as TransactionDetails
      }),
    )

    const totalPages = Math.ceil(filteredSignatures.length / limit)

    return {
      transactions: transactions.filter(Boolean) as TransactionDetails[],
      totalPages,
    }
  } catch (error) {
    console.error("Error fetching transaction history:", error)
    return { transactions: [], totalPages: 0 }
  }
}

export async function fetchWalletBalances(walletAddress: PublicKey) {
  return getWalletBalances(connection, walletAddress)
}

export async function fetchPortfolioHistory(walletAddress: PublicKey) {
  return getPortfolioHistory(walletAddress)
}

export async function fetchMarketData(tokenSymbols: string[]) {
  return getMarketData(tokenSymbols)
}

export async function fetchJupiterQuote(inputMint: string, outputMint: string, amount: string, slippageBps: number) {
  return getJupiterQuote(inputMint, outputMint, amount, slippageBps)
}

export async function fetchJupiterSwapInstructions(
  quoteResponse: any,
  userPublicKey: PublicKey,
  wrapAndUnwrapSol = true,
) {
  const { swapTransaction } = await getJupiterSwapInstructions(quoteResponse, userPublicKey, wrapAndUnwrapSol)
  const swapTransactionBuf = Buffer.from(swapTransaction, "base64")
  const transaction = VersionedTransaction.deserialize(swapTransactionBuf)

  // Jupiter's swap endpoint returns a single transaction that might contain setup, swap, and cleanup instructions.
  // We need to extract them if they are separate, but typically it's one compiled transaction.
  // For simplicity, we'll return the transaction and let the caller handle signing and sending.
  // If Jupiter's API changes to return separate instructions, this part would need adjustment.
  return {
    swapInstruction: transaction.message.compiledInstructions[0], // This is a simplification; actual instructions might be more complex
    cleanupInstruction: null, // Placeholder, Jupiter often bundles cleanup
    setupInstructions: [], // Placeholder, Jupiter often bundles setup
    transaction: transaction, // Return the full transaction for direct signing
  }
}

export async function fetchUserTransactions(
  userId: string,
  page: number,
  limit: number,
  searchQuery: string,
  transactionType: TransactionType | "all",
) {
  return getUserTransactions(userId, page, limit, searchQuery, transactionType)
}

export async function transferSPLToken(
  fromWallet: PublicKey,
  toWallet: PublicKey,
  mintAddress: PublicKey,
  amount: number,
  decimals: number,
) {
  const fromTokenAccount = getAssociatedTokenAddressSync(mintAddress, fromWallet)
  const toTokenAccount = getAssociatedTokenAddressSync(mintAddress, toWallet)

  const transferInstruction = createTransferInstruction(
    fromTokenAccount,
    toTokenAccount,
    fromWallet,
    amount * Math.pow(10, decimals), // Convert to smallest unit
    [],
    TOKEN_PROGRAM_ID,
  )

  const transaction = new Transaction().add(transferInstruction)
  return transaction
}

export async function sendVersionedTransaction(signedTransaction: VersionedTransaction) {
  const signature = await connection.sendTransaction(signedTransaction)
  await connection.confirmTransaction(signature, "confirmed")
  return signature
}

export async function fetchAllJupiterTokens(): Promise<JupiterToken[]> {
  return fetchJupiterTokenList()
}
