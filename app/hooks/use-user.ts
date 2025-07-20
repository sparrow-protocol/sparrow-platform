"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { getUser } from "@/db/queries"

export function useUser() {
  const { user } = usePrivy()
  const walletAddress = user?.wallet?.address

  const {
    data: dbUser,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dbUser", walletAddress],
    queryFn: () => (walletAddress ? getUser(walletAddress) : null),
    enabled: !!walletAddress,
  })

  const privyUser = useMemo(() => {
    if (!user) return null
    return user
  }, [user])

  const privyUserEmail = useMemo(() => {
    if (!user?.email) return null
    return user.email.address
  }, [user])

  const privyUserPhone = useMemo(() => {
    if (!user?.phone) return null
    return user.phone.number
  }, [user])

  const privyUserWalletAddress = useMemo(() => {
    if (!user?.wallet) return null
    return user.wallet.address
  }, [user])

  const privyUserWalletChainId = useMemo(() => {
    if (!user?.wallet) return null
    return user.wallet.chainId
  }, [user])

  const privyUserWalletConnectorType = useMemo(() => {
    if (!user?.wallet) return null
    return user.wallet.connectorType
  }, [user])

  const privyUserWalletWalletClientType = useMemo(() => {
    if (!user?.wallet) return null
    return user.wallet.walletClientType
  }, [user])

  const privyUserWalletWalletAccount = useMemo(() => {
    if (!user?.wallet) return null
    return user.wallet.walletAccount
  }, [user])

  const privyUserWalletSolana = useMemo(() => {
    if (!user?.solana) return null
    return user.solana
  }, [user])

  const privyUserWalletSolanaBalance = useMemo(() => {
    if (!user?.solana) return null
    return user.solana.balance
  }, [user])

  const privyUserWalletSolanaPublicKey = useMemo(() => {
    if (!user?.solana) return null
    return user.solana.publicKey
  }, [user])

  const privyUserWalletSolanaChainId = useMemo(() => {
    if (!user?.solana) return null
    return user.solana.chainId
  }, [user])

  const privyUserWalletSolanaCluster = useMemo(() => {
    if (!user?.solana) return null
    return user.solana.cluster
  }, [user])

  const privyUserWalletSolanaRpcUrl = useMemo(() => {
    if (!user?.solana) return null
    return user.solana.rpcUrl
  }, [user])

  const privyUserWalletSolanaSignMessage = useMemo(() => {
    if (!user?.solana) return null
    return user.solana.signMessage
  }, [user])

  const privyUserWalletSolanaSignTransaction = useMemo(() => {
    if (!user?.solana) return null
    return user.solana.signTransaction
  }, [user])

  const privyUserWalletSolanaSignAllTransactions = useMemo(() => {
    if (!user?.solana) return null
    return user.solana.signAllTransactions
  }, [user])

  const privyUserWalletSolanaSendTransaction = useMemo(() => {
    if (!user?.solana) return null
    return user.solana.sendTransaction
  }, [user])

  const privyUserWalletSolanaExportWallet = useMemo(() => {
    if (!user?.solana) return null
    return user.solana.exportWallet
  }, [user])

  const privyUserWalletSolanaDisconnect = useMemo(() => {
    if (!user?.solana) return null
    return user.solana.disconnect
  }, [user])

  return {
    privyUser,
    privyUserEmail,
    privyUserPhone,
    privyUserWalletAddress,
    privyUserWalletChainId,
    privyUserWalletConnectorType,
    privyUserWalletWalletClientType,
    privyUserWalletWalletAccount,
    privyUserWalletSolana,
    privyUserWalletSolanaBalance,
    privyUserWalletSolanaPublicKey,
    privyUserWalletSolanaChainId,
    privyUserWalletSolanaCluster,
    privyUserWalletSolanaRpcUrl,
    privyUserWalletSolanaSignMessage,
    privyUserWalletSolanaSignTransaction,
    privyUserWalletSolanaSignAllTransactions,
    privyUserWalletSolanaSendTransaction,
    privyUserWalletSolanaExportWallet,
    privyUserWalletSolanaDisconnect,
    dbUser,
    isLoading,
    error,
  }
}
