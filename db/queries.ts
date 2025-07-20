import { db } from "@/db/client"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import type { TransactionDetails, TransactionType } from "@/app/types/transactions"
import { MOCK_TRANSACTIONS } from "@/app/lib/mock-data"

export async function getUser(privyDID: string) {
  const [user] = await db.select().from(users).where(eq(users.privyDID, privyDID)).limit(1)
  return user
}

export async function createUser(privyDID: string, walletAddress: string, email?: string) {
  const [newUser] = await db
    .insert(users)
    .values({
      privyDID,
      walletAddress,
      email,
    })
    .returning()
  return newUser
}

export async function updateUserWalletAddress(privyDID: string, walletAddress: string) {
  const [updatedUser] = await db
    .update(users)
    .set({ walletAddress, updatedAt: new Date() })
    .where(eq(users.privyDID, privyDID))
    .returning()
  return updatedUser
}

export async function getUserTransactions(
  userId: string,
  page: number,
  limit: number,
  searchQuery: string,
  transactionType: TransactionType | "all",
): Promise<{ transactions: TransactionDetails[]; totalPages: number }> {
  // In a real application, you would query your database here
  // For now, we'll use the mock data and apply filters
  let filteredTransactions = MOCK_TRANSACTIONS

  if (searchQuery) {
    const lowerCaseQuery = searchQuery.toLowerCase()
    filteredTransactions = filteredTransactions.filter(
      (tx) =>
        tx.signature.toLowerCase().includes(lowerCaseQuery) ||
        tx.type.toLowerCase().includes(lowerCaseQuery) ||
        tx.accountKeys.some((key) => key.toLowerCase().includes(lowerCaseQuery)),
    )
  }

  if (transactionType !== "all") {
    filteredTransactions = filteredTransactions.filter((tx) => tx.type === transactionType)
  }

  // Simulate pagination
  const totalTransactions = filteredTransactions.length
  const totalPages = Math.ceil(totalTransactions / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)

  return {
    transactions: paginatedTransactions,
    totalPages: totalPages,
  }
}

export async function getTransactionDetails(signature: string): Promise<TransactionDetails | undefined> {
  // In a real application, you would fetch this from your database
  return MOCK_TRANSACTIONS.find((tx) => tx.signature === signature)
}

export async function addTransaction(transaction: Omit<TransactionDetails, "timestamp">) {
  // In a real application, you would insert this into your database
  console.log("Adding transaction to DB:", transaction)
  // MOCK_TRANSACTIONS.push({ ...transaction, timestamp: new Date().toISOString() }); // For in-memory mock
}
