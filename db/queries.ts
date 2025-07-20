import { db } from "./client"
import { transactions, users } from "./schema"
import { eq, desc } from "drizzle-orm"
import type { InsertTransaction, SelectTransaction } from "@/app/types/transactions"
import type { InsertUser, SelectUser } from "@/app/types/users"

export async function getUserTransactions(userId: string): Promise<SelectTransaction[]> {
  const userTransactions = await db.query.transactions.findMany({
    where: eq(transactions.userId, userId),
    orderBy: [desc(transactions.createdAt)],
  })
  return userTransactions
}

export async function insertTransaction(transaction: InsertTransaction): Promise<SelectTransaction> {
  const [newTransaction] = await db.insert(transactions).values(transaction).returning()
  return newTransaction
}

export async function upsertUser(user: InsertUser): Promise<SelectUser> {
  const [upsertedUser] = await db
    .insert(users)
    .values(user)
    .onConflictDoUpdate({
      target: users.privyId,
      set: {
        walletAddress: user.walletAddress,
        lastLogin: new Date(),
      },
    })
    .returning()
  return upsertedUser
}

export async function getUserByPrivyId(privyId: string): Promise<SelectUser | undefined> {
  return db.query.users.findFirst({
    where: eq(users.privyId, privyId),
  })
}

export async function getUserById(userId: string): Promise<SelectUser | undefined> {
  return db.query.users.findFirst({
    where: eq(users.id, userId),
  })
}
