"use server"

import { upsertUser as dbUpsertUser } from "@/db/queries"

export async function upsertUser(id: string, email: string, username: string, walletAddress: string) {
  try {
    const user = await dbUpsertUser(id, email, username, walletAddress)
    return { success: true, user }
  } catch (error) {
    console.error("Error in upsertUser server action:", error)
    return { success: false, error: "Failed to upsert user" }
  }
}
