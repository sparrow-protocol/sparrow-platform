"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Button } from "@/components/ui/button"
import { usePrivy } from "@privy-io/react-auth"
import { useWallets } from "@privy-io/react-auth/wallets"
import { useEffect } from "react"
import { toast } from "sonner"

export function WalletStatus() {
  const { connected, publicKey } = useWallet()
  const { user, linkWallet, authenticated } = usePrivy()
  const { wallets } = useWallets()

  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy")

  useEffect(() => {
    if (connected && publicKey && authenticated && !embeddedWallet) {
      // Link the Solana wallet to Privy if not already linked
      const linkSolanaWallet = async () => {
        try {
          await linkWallet({
            solana: {
              connector: async () => {
                // This function should return a Privy-compatible Solana wallet provider.
                // For wallet-adapter, you might need to adapt it or use Privy's direct Solana integration.
                // For simplicity, we'll assume a direct linking mechanism or a custom connector.
                // In a real app, you'd use Privy's `linkWallet` with the appropriate Solana wallet.
                toast.info("Linking Solana wallet to Privy...")
                return {
                  address: publicKey.toBase58(),
                  chainId: "solana:devnet", // Or mainnet-beta, testnet
                  walletClientType: "external",
                  provider: null, // Or the actual provider if available
                }
              },
            },
          })
          toast.success("Solana wallet linked to Privy!")
        } catch (error) {
          console.error("Failed to link Solana wallet to Privy:", error)
          toast.error("Failed to link Solana wallet to Privy.")
        }
      }
      linkSolanaWallet()
    }
  }, [connected, publicKey, authenticated, embeddedWallet, linkWallet])

  return (
    <div className="flex items-center gap-2">
      {connected ? (
        <span className="text-sm font-medium text-green-500">
          Connected: {publicKey?.toBase58().slice(0, 4)}...{publicKey?.toBase58().slice(-4)}
        </span>
      ) : (
        <WalletMultiButton>
          <Button>Connect Solana Wallet</Button>
        </WalletMultiButton>
      )}
    </div>
  )
}
