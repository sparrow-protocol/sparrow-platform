import { db } from "@/db/client"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getUserByPrivyId(privyId: string) {
  const [user] = await db.select().from(users).where(eq(users.privyId, privyId)).limit(1)
  return user
}

export async function getUserByWalletAddress(walletAddress: string) {
  const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress)).limit(1)
  return user
}

export async function createUserInDb(privyId: string, walletAddress: string, email: string | null) {
  const [newUser] = await db.insert(users).values({ privyId, walletAddress, email }).returning()
  return newUser
}
