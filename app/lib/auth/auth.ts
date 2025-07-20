import { auth } from "@privy-io/next-privy"
import { redirect } from "next/navigation"
import { db } from "@/db/client"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getUserId() {
  const { user } = await auth()
  if (!user) {
    redirect("/auth/login")
  }
  return user.id
}

export async function getAuthenticatedUser() {
  const { user } = await auth()
  if (!user) {
    redirect("/auth/login")
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.privyId, user.id),
  })

  if (!dbUser) {
    // This should ideally not happen if user creation is handled on first login
    // Consider creating the user here if it's a new Privy user
    console.error("Authenticated Privy user not found in DB:", user.id)
    redirect("/auth/login") // Or redirect to an onboarding page
  }

  return dbUser
}

export async function getPrivyUser() {
  const { user } = await auth()
  return user
}
