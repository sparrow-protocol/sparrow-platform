"use client"

import { usePrivy, useWallets } from "@privy-io/react-auth"
import { useMemo } from "react"
import { PublicKey } from "@solana/web3.js"

export function useWalletsWithSolana() {
  const { wallets } = useWallets()
  const { user } = usePrivy()

  const embeddedWallet = useMemo(() => {
    return wallets.find((wallet) => wallet.walletClientType === "privy")
  }, [wallets])

  const externalWallets = useMemo(() => {
    return wallets.filter((wallet) => wallet.walletClientType !== "privy")
  }, [wallets])

  const allWallets = useMemo(() => {
    return wallets
  }, [wallets])

  const embeddedWalletPubkey = useMemo(() => {
    if (!embeddedWallet) return null
    return new PublicKey(embeddedWallet.address)
  }, [embeddedWallet])

  const externalWalletsPubkeys = useMemo(() => {
    return externalWallets.map((wallet) => new PublicKey(wallet.address))
  }, [externalWallets])

  const allWalletsPubkeys = useMemo(() => {
    return allWallets.map((wallet) => new PublicKey(wallet.address))
  }, [allWallets])

  const primaryWallet = useMemo(() => {
    if (!user) return null
    return user.wallet
  }, [user])

  const primaryWalletPubkey = useMemo(() => {
    if (!primaryWallet) return null
    return new PublicKey(primaryWallet.address)
  }, [primaryWallet])

  return {
    embeddedWallet,
    externalWallets,
    allWallets,
    embeddedWalletPubkey,
    externalWalletsPubkeys,
    allWalletsPubkeys,
    primaryWallet,
    primaryWalletPubkey,
  }
}
