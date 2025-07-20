import { db } from "./client"
import { users, transactions } from "./schema"
import { eq } from "drizzle-orm"
import type { User } from "@/app/types/users"
import type { Transaction } from "@/app/types/transactions"

export async function getUser(walletAddress: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress)).limit(1)
  return user
}

export async function createUser(userData: {
  privyId: string
  walletAddress: string
  email: string | null
}): Promise<User> {
  const [newUser] = await db.insert(users).values(userData).returning()
  return newUser
}

export async function getTransactionsByUserId(userId: string): Promise<Transaction[]> {
  const result = await db.select().from(transactions).where(eq(transactions.userId, userId))
  return result.map((tx) => ({
    ...tx,
    amount: Number.parseFloat(tx.amount),
    fee: tx.fee ? Number.parseFloat(tx.fee) : undefined,
  }))
}

export async function addTransaction(
  transactionData: Omit<Transaction, "id"> & { userId: string },
): Promise<Transaction> {
  const [newTransaction] = await db
    .insert(transactions)
    .values({
      ...transactionData,
      amount: transactionData.amount.toString(),
      fee: transactionData.fee?.toString(),
    })
    .returning()
  return {
    ...newTransaction,
    amount: Number.parseFloat(newTransaction.amount),
    fee: newTransaction.fee ? Number.parseFloat(newTransaction.fee) : undefined,
  }
}
