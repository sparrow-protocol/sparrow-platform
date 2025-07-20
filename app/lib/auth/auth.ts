import { auth } from "@privy-io/next-app-router/api"
import { headers } from "next/headers"

export async function getPrivyAuth() {
  try {
    const privyAuth = await auth.authenticate(headers())
    return privyAuth
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}
