"use server"

import { db } from "@/db/client"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function createUser(userData: { privyId: string; walletAddress: string; email: string | null }) {
  try {
    const existingUser = await db.select().from(users).where(eq(users.privyId, userData.privyId)).limit(1)

    if (existingUser.length > 0) {
      console.log("User already exists:", existingUser[0].privyId)
      return existingUser[0]
    }

    const [newUser] = await db.insert(users).values(userData).returning()
    return newUser
  } catch (error) {
    console.error("Error creating user:", error)
    throw new Error("Failed to create user.")
  }
}

export async function getUser(walletAddress: string) {
  try {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, walletAddress)).limit(1)
    return user
  } catch (error) {
    console.error("Error fetching user:", error)
    throw new Error("Failed to fetch user.")
  }
}
