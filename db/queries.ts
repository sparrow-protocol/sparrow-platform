import { db } from "./client"
import { transactions, users } from "./schema"
import { eq, desc, sql, like, and } from "drizzle-orm"
import type { Transaction, TransactionType } from "@/app/types/transactions"

export async function getUserById(id: string) {
  return await db.query.users.findFirst({
    where: eq(users.id, id),
  })
}

export async function getUserByEmail(email: string) {
  return await db.query.users.findFirst({
    where: eq(users.email, email),
  })
}

export async function createUser(id: string, email: string, username: string) {
  return await db.insert(users).values({ id, email, username }).returning().get()
}

export async function getUserTransactions(
  userId: string,
  page = 1,
  query = "",
  type: TransactionType | "all" = "all",
  limit = 10,
) {
  const offset = (page - 1) * limit

  const conditions = [eq(transactions.userId, userId)]

  if (query) {
    conditions.push(like(transactions.signature, `%${query}%`))
  }

  if (type !== "all") {
    conditions.push(eq(transactions.type, type))
  }

  const filteredTransactions = await db.query.transactions.findMany({
    where: and(...conditions),
    orderBy: desc(transactions.timestamp),
    limit,
    offset,
  })

  const totalTransactions = await db
    .select({ count: sql<number>`count(*)` })
    .from(transactions)
    .where(and(...conditions))
    .get()

  return {
    transactions: filteredTransactions,
    totalPages: Math.ceil(totalTransactions.count / limit),
  }
}

export async function getTransactionBySignature(signature: string): Promise<Transaction | undefined> {
  return await db.query.transactions.findFirst({
    where: eq(transactions.signature, signature),
  })
}
