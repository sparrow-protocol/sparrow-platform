"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useWallets } from "@privy-io/react-auth/wallets"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CopyButton } from "@/components/copy-button"
import { formatAddress } from "@/app/lib/format/address"
import { useUser } from "@/app/hooks/use-user"
import { useEffect } from "react"
import { createUser } from "@/server/actions/user"
import { toast } from "sonner"

export function EmbeddedWallet() {
  const { user } = usePrivy()
  const { wallets } = useWallets()
  const { dbUser, isLoading } = useUser()

  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy")

  useEffect(() => {
    const handleCreateUser = async () => {
      if (user && user.wallet && !dbUser && !isLoading) {
        try {
          await createUser({
            privyId: user.id,
            walletAddress: user.wallet.address,
            email: user.email?.address || null,
          })
          toast.success("User created successfully!")
        } catch (error) {
          console.error("Failed to create user:", error)
          toast.error("Failed to create user.")
        }
      }
    }
    handleCreateUser()
  }, [user, dbUser, isLoading])

  if (!embeddedWallet) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Embedded Wallet</CardTitle>
          <CardDescription>No embedded wallet found.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Embedded Wallet</CardTitle>
        <CardDescription>Your Privy embedded wallet details.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Address:</span>
          <div className="flex items-center gap-2">
            <span>{formatAddress(embeddedWallet.address)}</span>
            <CopyButton value={embeddedWallet.address} />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Chain:</span>
          <span>{embeddedWallet.chain?.name || "N/A"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Wallet Type:</span>
          <span>{embeddedWallet.walletClientType}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Connected:</span>
          <span>{embeddedWallet.connected ? "Yes" : "No"}</span>
        </div>
        <Button onClick={embeddedWallet.disconnect}>Disconnect Wallet</Button>
      </CardContent>
    </Card>
  )
}
