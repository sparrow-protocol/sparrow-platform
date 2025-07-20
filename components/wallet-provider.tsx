"use client"

import type React from "react"
import { useMemo } from "react"
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from "@solana/wallet-adapter-react"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom"
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { clusterApiUrl } from "@solana/web3.js"
import { usePrivy } from "@privy-io/react-auth"
import { useEmbeddedWallet } from "@/app/hooks/use-embedded-wallet"
import { useWallets } from "@/hooks/use-wallets"

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css"

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Devnet // Or Mainnet-beta, Testnet
  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  const { wallets: privyWallets } = usePrivy()
  const { embeddedWallet } = useEmbeddedWallet()
  const { wallets: allWallets } = useWallets()

  const wallets = useMemo(() => {
    const adapters = [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network })]

    // Add embedded wallet if available
    if (embeddedWallet) {
      adapters.push(embeddedWallet)
    }

    return adapters
  }, [network, embeddedWallet])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  )
}
