"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useQuery } from "@tanstack/react-query"
import { getUser } from "@/server/actions/user"

export function useUser() {
  const { user: privyUser, authenticated } = usePrivy()

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", privyUser?.id],
    queryFn: async () => {
      if (!privyUser?.id) return null
      return getUser(privyUser.id)
    },
    enabled: authenticated && !!privyUser?.id,
  })

  return { user, isLoading, isAuthenticated: authenticated }
}
