"use client"

import { usePrivy, useWallets } from "@privy-io/react-auth"
import { useMemo } from "react"
import { PublicKey } from "@solana/web3.js"
import type { WalletClient } from "viem"
import { createWalletClient, custom } from "viem"
import { solana } from "viem/chains"

export function useEmbeddedWallet() {
  const { wallets } = useWallets()
  const { user } = usePrivy()

  const embeddedWallet = useMemo(() => {
    return wallets.find((wallet) => wallet.walletClientType === "privy")
  }, [wallets])

  const embeddedWalletClient = useMemo<WalletClient | undefined>(() => {
    if (!embeddedWallet) return undefined
    return createWalletClient({
      chain: solana,
      transport: custom(embeddedWallet.provider),
    })
  }, [embeddedWallet])

  const embeddedWalletPubkey = useMemo(() => {
    if (!embeddedWallet) return null
    return new PublicKey(embeddedWallet.address)
  }, [embeddedWallet])

  const embeddedWalletUser = useMemo(() => {
    if (!user) return null
    return user.linkedAccounts.find(
      (account) =>
        account.type === "wallet" && account.walletClientType === "privy" && account.connectorType === "embedded",
    )
  }, [user])

  const embeddedWalletPublicKey = useMemo(() => {
    if (!embeddedWallet) return null
    return new PublicKey(embeddedWallet.publicKey)
  }, [embeddedWallet])

  const embeddedWalletAddress = useMemo(() => {
    return user?.wallet?.address
  }, [user])

  const embeddedWalletBalance = useMemo(() => {
    if (!user?.solana) return null
    return user.solana.balance
  }, [user])

  const embeddedWalletChainId = useMemo(() => {
    if (!embeddedWallet) return null
    return embeddedWallet.chainId
  }, [embeddedWallet])

  const embeddedWalletConnectorType = useMemo(() => {
    if (!embeddedWallet) return null
    return embeddedWallet.connectorType
  }, [embeddedWallet])

  const embeddedWalletWalletClientType = useMemo(() => {
    if (!embeddedWallet) return null
    return embeddedWallet.walletClientType
  }, [embeddedWallet])

  const embeddedWalletWalletAccount = useMemo(() => {
    if (!embeddedWallet) return null
    return embeddedWallet.walletAccount
  }, [embeddedWallet])

  const embeddedWalletSignMessage = useMemo(() => {
    if (!embeddedWallet) return null
    return embeddedWallet.signMessage
  }, [embeddedWallet])

  const embeddedWalletSignTransaction = useMemo(() => {
    if (!embeddedWallet) return null
    return embeddedWallet.signTransaction
  }, [embeddedWallet])

  const embeddedWalletSignAllTransactions = useMemo(() => {
    if (!embeddedWallet) return null
    return embeddedWallet.signAllTransactions
  }, [embeddedWallet])

  const embeddedWalletSendTransaction = useMemo(() => {
    if (!embeddedWallet) return null
    return embeddedWallet.sendTransaction
  }, [embeddedWallet])

  const embeddedWalletRpcUrl = useMemo(() => {
    if (!embeddedWallet) return null
    return embeddedWallet.rpcUrl
  }, [embeddedWallet])

  const embeddedWalletSwitchChain = useMemo(() => {
    if (!embeddedWallet) return null
    return embeddedWallet.switchChain
  }, [embeddedWallet])

  const embeddedWalletGet = useMemo(() => {
    if (!embeddedWallet) return null
    return embeddedWallet.get
  }, [embeddedWallet])

  const embeddedWalletSet = useMemo(() => {
    if (!embeddedWallet) return null
    return embeddedWallet.set
  }, [embeddedWallet])

  const embeddedWalletExportWallet = useMemo(() => {
    if (!embeddedWallet) return null
    return embeddedWallet.exportWallet
  }, [embeddedWallet])

  const embeddedWalletDisconnect = useMemo(() => {
    if (!embeddedWallet) return null
    return embeddedWallet.disconnect
  }, [embeddedWallet])

  return {
    embeddedWallet,
    embeddedWalletClient,
    embeddedWalletPubkey,
    embeddedWalletUser,
    embeddedWalletPublicKey,
    embeddedWalletAddress,
    embeddedWalletBalance,
    embeddedWalletChainId,
    embeddedWalletConnectorType,
    embeddedWalletWalletClientType,
    embeddedWalletWalletAccount,
    embeddedWalletSignMessage,
    embeddedWalletSignTransaction,
    embeddedWalletSignAllTransactions,
    embeddedWalletSendTransaction,
    embeddedWalletRpcUrl,
    embeddedWalletSwitchChain,
    embeddedWalletGet,
    embeddedWalletSet,
    embeddedWalletExportWallet,
    embeddedWalletDisconnect,
  }
}
