import { HELIUS_API_KEY } from "@/app/lib/constants"
import {
  Connection,
  PublicKey,
  Transaction as SolanaTransaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import {
  getJupiterQuote,
  getJupiterSwapInstructions,
  fetchAllJupiterTokens,
  sendVersionedTransaction,
} from "@/app/lib/jupiter/jupiter-api" // Ensure fetchAllJupiterTokens is imported
import { getAssociatedTokenAddressSync, createTransferInstruction } from "@solana/spl-token"
import type { TransactionDetails, TransactionType } from "@/app/types/transactions"
import { formatTimestamp } from "@/app/lib/format/date"
import type { WalletData } from "@/app/types/wallet"
import type { TokenInfo } from "../types/solana"
import { getJupiterTokenList } from "./jupiter/jupiter-token"
import { getWalletBalances } from "./solana/wallet-balances"
import { getTransactionHistory } from "./solana/transaction-history"
import { getPortfolioHistory } from "./solana/portfolio-history"
import { getMarketData } from "./market-data"
import type { ChartData, ChartPeriod } from "../types/chart"
import type { JupiterToken } from "../types/jupiter"
import { MOCK_TRANSACTIONS } from "./mock-data"
import type { SolanaToken, SolanaWalletBalance } from "@/app/types/solana"
import { fetchJupiterTokenList as fetchOriginalJupiterTokenList } from "./jupiter/jupiter-token"
import { fetchJupiterQuote as fetchOriginalJupiterQuote, fetchJupiterSwap } from "./jupiter/jupiter-api"
import type { WalletBalance } from "../types/wallet"
import type { Transaction } from "../types/transactions"

const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com"
const connection = new Connection(SOLANA_RPC_URL, "confirmed")

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

export async function fetchWalletData(publicKey: PublicKey): Promise<WalletData> {
  const balances = await getSolanaWalletBalances(publicKey)
  const portfolioHistory = await getSolanaPortfolioHistory(publicKey)

  return {
    balances,
    portfolioHistory,
  }
}

export async function fetchRecentTransactions(walletAddress: string): Promise<SolanaTransaction[]> {
  // In a real application, this would fetch data from a Solana RPC or indexer
  // For now, we return mock data
  console.log(`Fetching transactions for ${walletAddress}`)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_TRANSACTIONS)
    }, 700)
  })
}

export async function fetchTransactionDetails(signature: string): Promise<SolanaTransaction | null> {
  try {
    const tx = await connection.getTransaction(signature, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    })

    if (!tx) {
      return null
    }

    // Basic parsing for display
    const type = "Unknown" // More sophisticated parsing needed for actual types
    const source = "N/A"
    const destination = "N/A"
    const amount = 0
    const fee = tx.meta?.fee ? tx.meta.fee / 10 ** 9 : 0 // Convert lamports to SOL
    const status = tx.meta?.err ? "Failed" : "Completed"
    const timestamp = tx.blockTime ? new Date(tx.blockTime * 1000) : new Date()

    return {
      signature,
      type,
      source,
      destination,
      amount,
      timestamp,
      status,
      fee,
    }
  } catch (error) {
    console.error("Error fetching transaction details:", error)
    return null
  }
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
          : "program_interaction"

        return {
          signature: sigInfo.signature,
          timestamp: formatTimestamp(sigInfo.blockTime ? sigInfo.blockTime * 1000 : Date.now()),
          type: type,
          status: sigInfo.err ? "failed" : "success",
          fee: tx.meta?.fee ? tx.meta.fee / 1_000_000_000 : 0,
          block: tx.slot,
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
      logMessages: tx.meta?.logMessages || [],
      accountKeys: tx.transaction.message.staticAccountKeys.map((key) => key.toBase58()),
      preBalances: tx.meta?.preBalances || [],
      postBalances: tx.meta?.postBalances || [],
      preTokenBalances: tx.meta?.preTokenBalances || [],
      postTokenBalances: tx.meta?.postTokenBalances || [],
    }
  } catch (error) {
    console.error(`Error fetching transaction details for ${signature}:`, error)
    return null
  }
}

export async function getSolanaTransactionHistory(publicKey: PublicKey): Promise<Transaction[]> {
  return getTransactionHistory(connection, publicKey)
}

export async function getSolanaPortfolioHistory(publicKey: PublicKey, period: ChartPeriod): Promise<ChartData[]> {
  return getPortfolioHistory(publicKey, period)
}

export async function getSolanaMarketData(tokenSymbol: string, currency: string): Promise<any> {
  return getMarketData(tokenSymbol, currency)
}

export async function getSolanaWalletBalances(publicKey: PublicKey): Promise<WalletBalance[]> {
  return getWalletBalances(connection, publicKey)
}

export async function fetchJupiterTokenList(): Promise<JupiterToken[]> {
  return getJupiterTokenList()
}

// Re-export Jupiter API functions with their original names as requested by the error
export { getJupiterQuote as fetchJupiterQuote }
export { getJupiterSwapInstructions as fetchJupiterSwapInstructions }
export { fetchAllJupiterTokens } // Explicitly re-export fetchAllJupiterTokens
export { sendVersionedTransaction }

export async function transferSPLToken(
  fromWallet: PublicKey,
  toWallet: PublicKey,
  mintAddress: PublicKey,
  amount: number,
  decimals: number,
): Promise<SolanaTransaction> {
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

  const transaction = new SolanaTransaction().add(transferInstruction)
  return transaction
}

export async function fetchTokenInfo(tokenAddress: string): Promise<TokenInfo | null> {
  try {
    const response = await fetch(`https://token.jup.ag/all?addresses=${tokenAddress}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: TokenInfo[] = await response.json()
    if (data.length > 0) {
      return data[0]
    }
    return null
  } catch (error) {
    console.error(`Error fetching token info for ${tokenAddress}:`, error)
    return null
  }
}

export async function getTokenBalances(publicKey: PublicKey): Promise<SolanaWalletBalance[]> {
  try {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: TOKEN_PROGRAM_ID,
    })

    const tokenList = await fetchOriginalJupiterTokenList()
    const balances: SolanaWalletBalance[] = []

    for (const account of tokenAccounts.value) {
      const mintAddress = account.account.data.parsed.info.mint
      const amount = account.account.data.parsed.info.tokenAmount.uiAmount

      const tokenMeta = tokenList.find((token) => token.address === mintAddress)

      if (tokenMeta && amount > 0) {
        // For simplicity, we'll mock price data. In a real app, fetch from a price oracle.
        const pricePerToken = Math.random() * 10 // Mock price
        const usdValue = amount * pricePerToken

        balances.push({
          mint: new PublicKey(mintAddress),
          tokenSymbol: tokenMeta.symbol,
          balance: amount,
          usdValue: usdValue,
          pricePerToken: pricePerToken,
          logoURI: tokenMeta.logoURI,
        })
      }
    }
    return balances
  } catch (error) {
    console.error("Error fetching token balances:", error)
    return []
  }
}

export async function getSolBalance(publicKey: PublicKey): Promise<number> {
  try {
    const balance = await connection.getBalance(publicKey)
    return balance / LAMPORTS_PER_SOL
  } catch (error) {
    console.error("Error fetching SOL balance:", error)
    return 0
  }
}

export async function performSwap(
  fromToken: SolanaToken,
  toToken: SolanaToken,
  amount: number,
  userPublicKey: PublicKey,
  signTransaction: (transaction: SolanaTransaction) => Promise<SolanaTransaction>,
): Promise<string | null> {
  try {
    const quote = await fetchOriginalJupiterQuote(fromToken.address, toToken.address, amount, fromToken.decimals)

    if (!quote) {
      throw new Error("Failed to get swap quote from Jupiter.")
    }

    const swapResult = await fetchJupiterSwap(quote.swapInstruction, userPublicKey.toBase58())

    if (!swapResult || !swapResult.swapTransaction) {
      throw new Error("Failed to get swap transaction from Jupiter.")
    }

    const swapTransactionBuf = Buffer.from(swapResult.swapTransaction, "base64")
    const transaction = SolanaTransaction.from(swapTransactionBuf)

    const signedTransaction = await signTransaction(transaction)
    const rawTransaction = signedTransaction.serialize()

    const signature = await connection.sendRawTransaction(rawTransaction, {
      skipPreflight: true, // Set to false in production after testing
      maxRetries: 2,
    })

    await connection.confirmTransaction(signature, "confirmed")

    console.log("Swap successful with signature:", signature)
    return signature
  } catch (error) {
    console.error("Error performing swap:", error)
    return null
  }
}

export async function requestAirdrop(publicKey: PublicKey, amount = 1): Promise<string | null> {
  try {
    const airdropSignature = await connection.requestAirdrop(publicKey, amount * LAMPORTS_PER_SOL)
    await connection.confirmTransaction(airdropSignature, "confirmed")
    return airdropSignature
  } catch (error) {
    console.error("Error requesting airdrop:", error)
    return null
  }
}

export async function sendSolanaPayment(
  fromPublicKey: PublicKey,
  toPublicKey: PublicKey,
  amount: number,
  signTransaction: (transaction: SolanaTransaction) => Promise<SolanaTransaction>,
): Promise<string | null> {
  try {
    const transaction = new SolanaTransaction().add(
      SystemProgram.transfer({
        fromPubkey: fromPublicKey,
        toPubkey: toPublicKey,
        lamports: amount * LAMPORTS_PER_SOL,
      }),
    )

    const { blockhash } = await connection.getLatestBlockhash()
    transaction.recentBlockhash = blockhash
    transaction.feePayer = fromPublicKey

    const signedTransaction = await signTransaction(transaction)
    const signature = await connection.sendRawTransaction(signedTransaction.serialize())

    await connection.confirmTransaction(signature, "confirmed")
    return signature
  } catch (error) {
    console.error("Error sending Solana payment:", error)
    return null
  }
}
