"use client"

import { usePrivy, useWallets } from "@privy-io/react-auth"
import { useEffect, useState } from "react"
import type { EmbeddedWallet as PrivyEmbeddedWallet } from "@privy-io/react-auth"

export function useEmbeddedWallet() {
  const { user, ready } = usePrivy()
  const { wallets } = useWallets()
  const [embeddedWallet, setEmbeddedWallet] = useState<PrivyEmbeddedWallet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!ready) return

    const privyEmbeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy") as
      | PrivyEmbeddedWallet
      | undefined

    if (privyEmbeddedWallet) {
      setEmbeddedWallet(privyEmbeddedWallet)
      setIsLoading(false)
    } else if (
      user &&
      user.linkedAccounts.some((account) => account.type === "wallet" && account.walletClientType === "privy")
    ) {
      // If user has an embedded wallet but it's not in `wallets` yet (e.g., during initial load)
      // This might indicate a slight delay in Privy's wallet loading or a need to re-fetch
      setIsLoading(true) // Keep loading until it appears or we confirm it's not there
    } else {
      setEmbeddedWallet(null)
      setIsLoading(false)
    }
  }, [ready, user, wallets])

  const createEmbeddedWallet = async () => {
    if (!user) {
      setError(new Error("User not authenticated to create embedded wallet."))
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      await user.createWallet()
      // The wallet should now appear in the `wallets` array, triggering the useEffect
    } catch (e) {
      console.error("Error creating embedded wallet:", e)
      setError(e as Error)
    } finally {
      setIsLoading(false)
    }
  }

  return { embeddedWallet, createEmbeddedWallet, isLoading, error }
}
