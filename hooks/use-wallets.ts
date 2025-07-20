"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { usePrivy } from "@privy-io/react-auth"
import { useMemo } from "react"
import { PublicKey } from "@solana/web3.js"

export function useWallets() {
  const { publicKey: solanaPublicKey, connected: solanaConnected } = useWallet()
  const { wallets, authenticated } = usePrivy()

  const embeddedWallet = useMemo(() => {
    return wallets.find((wallet) => wallet.walletClientType === "privy")
  }, [wallets])

  const embeddedWalletAddress = useMemo(() => {
    return embeddedWallet?.address
  }, [embeddedWallet])

  const userPublicKey = useMemo(() => {
    if (embeddedWalletAddress) return new PublicKey(embeddedWalletAddress)
    if (solanaPublicKey) return solanaPublicKey
    return null
  }, [embeddedWalletAddress, solanaPublicKey])

  const isConnected = authenticated && (solanaConnected || !!embeddedWalletAddress)

  return {
    solanaPublicKey,
    solanaConnected,
    embeddedWallet,
    embeddedWalletAddress,
    userPublicKey,
    isConnected,
  }
}
