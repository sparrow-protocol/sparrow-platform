"use client"

import { useWallets as usePrivyWallets } from "@privy-io/react-auth"
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react"
import { useEffect, useState } from "react"
import type { Wallet as PrivyWallet } from "@privy-io/react-auth"
import type { Wallet as SolanaWalletAdapter } from "@solana/wallet-adapter-react"

interface CombinedWallet {
  address: string
  type: "privy" | "solana-adapter"
  privyWallet?: PrivyWallet
  solanaWalletAdapter?: SolanaWalletAdapter
}

export function useWallets() {
  const { wallets: privyWallets } = usePrivyWallets()
  const { wallet: solanaAdapterWallet, publicKey, connected } = useSolanaWallet()
  const [combinedWallets, setCombinedWallets] = useState<CombinedWallet[]>([])

  useEffect(() => {
    const newCombinedWallets: CombinedWallet[] = []

    // Add Privy wallets
    privyWallets.forEach((privyWallet) => {
      newCombinedWallets.push({
        address: privyWallet.address,
        type: "privy",
        privyWallet: privyWallet,
      })
    })

    // Add Solana wallet adapter if connected and not already added by Privy (e.g., Phantom)
    if (connected && publicKey && solanaAdapterWallet) {
      const isAlreadyAdded = newCombinedWallets.some((w) => w.address === publicKey.toBase58() && w.type === "privy")
      if (!isAlreadyAdded) {
        newCombinedWallets.push({
          address: publicKey.toBase58(),
          type: "solana-adapter",
          solanaWalletAdapter: solanaAdapterWallet,
        })
      }
    }

    setCombinedWallets(newCombinedWallets)
  }, [privyWallets, solanaAdapterWallet, publicKey, connected])

  return {
    wallets: combinedWallets,
    // You can add more utility functions here if needed, e.g., findWalletByAddress
  }
}
