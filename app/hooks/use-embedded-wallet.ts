"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useMemo } from "react"

export function useEmbeddedWallet() {
  const { wallets } = usePrivy()

  const embeddedWallet = useMemo(() => {
    return wallets.find((wallet) => wallet.walletClientType === "privy")
  }, [wallets])

  const embeddedWalletAddress = useMemo(() => {
    return embeddedWallet?.address
  }, [embeddedWallet])

  return { embeddedWallet, embeddedWalletAddress }
}
