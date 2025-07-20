"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useQuery } from "@tanstack/react-query"
import { getUserById } from "@/db/queries"
import { useEffect } from "react"
import { upsertUser } from "@/db/queries"
import { useWallet } from "@solana/wallet-adapter-react"

export function useUser() {
  const { user: privyUser, authenticated } = usePrivy()
  const { publicKey } = useWallet()

  const {
    data: dbUser,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dbUser", privyUser?.id],
    queryFn: async () => {
      if (!privyUser?.id) return null
      return getUserById(privyUser.id)
    },
    enabled: authenticated && !!privyUser?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Effect to upsert user on initial login or wallet connection
  useEffect(() => {
    const handleUpsert = async () => {
      if (authenticated && privyUser && publicKey) {
        try {
          await upsertUser({
            privyId: privyUser.id,
            walletAddress: publicKey.toBase58(),
            lastLogin: new Date(),
          })
          refetch() // Refetch to get the latest user data from DB
        } catch (e) {
          console.error("Error upserting user:", e)
        }
      }
    }
    handleUpsert()
  }, [authenticated, privyUser, publicKey, refetch])

  return {
    user: dbUser,
    privyUser,
    isLoading,
    error,
    isAuthenticated: authenticated,
    refetchUser: refetch,
  }
}
