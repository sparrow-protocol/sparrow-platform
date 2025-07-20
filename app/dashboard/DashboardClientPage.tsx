"use client"

import { CardDescription } from "@/components/ui/card"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Shell } from "@/components/shell"
import { RecentTransactionsTable } from "@/components/dashboard/recent-transactions-table"
import { PortfolioValueChart } from "@/components/dashboard/portfolio-value-chart"
import { fetchWalletData, fetchRecentTransactions } from "@/app/lib/defi-api"
import { formatPrice } from "@/app/lib/format/price"
import { formatNumber } from "@/app/lib/format/number"
import { useEmbeddedWallet } from "@/app/hooks/use-embedded-wallet"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { TransactionType } from "@/app/types/transactions"
import { usePrivy } from "@privy-io/react-auth"
import { Wallet, TrendingUp, BarChart } from "lucide-react" // Added BarChart icon

export default function DashboardClientPage() {
  const { publicKey: solanaPublicKey } = useWallet()
  const { embeddedWalletAddress } = useEmbeddedWallet()
  const { user } = usePrivy()

  const walletAddress = useMemo(() => {
    if (embeddedWalletAddress) return new PublicKey(embeddedWalletAddress)
    if (solanaPublicKey) return solanaPublicKey
    return null
  }, [embeddedWalletAddress, solanaPublicKey])

  const userId = user?.id || null

  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [transactionType, setTransactionType] = useState<TransactionType | "all">("all")

  const {
    data: walletData,
    isLoading: isLoadingWalletData,
    isError: isErrorWalletData,
  } = useQuery({
    queryKey: ["walletData", walletAddress?.toBase58()],
    queryFn: () => {
      if (!walletAddress) throw new Error("Wallet address is not available.")
      return fetchWalletData(walletAddress)
    },
    enabled: !!walletAddress,
    staleTime: 1000 * 60, // 1 minute
  })

  const {
    data: transactionsData,
    isLoading: isLoadingTransactions,
    isError: isErrorTransactions,
  } = useQuery({
    queryKey: ["userTransactions", userId, currentPage, searchQuery, transactionType],
    queryFn: () => {
      if (!userId) throw new Error("User ID is not available.")
      return fetchRecentTransactions(userId, currentPage, searchQuery, transactionType)
    },
    enabled: !!userId,
    staleTime: 1000 * 30, // 30 seconds
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new
  })

  const totalPortfolioValue = useMemo(() => {
    return walletData?.balances.reduce((sum, token) => sum + (token.valueUsd || 0), 0) || 0
  }, [walletData])

  const topTokens = useMemo(() => {
    return (
      walletData?.balances
        .filter((token) => token.valueUsd !== null && token.valueUsd > 0)
        .sort((a, b) => (b.valueUsd || 0) - (a.valueUsd || 0))
        .slice(0, 5) || []
    )
  }, [walletData])

  if (!walletAddress) {
    return (
      <Shell className="container">
        <PageHeader
          heading="Connect Wallet"
          text="Please connect your Solana wallet or log in to view your dashboard."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </Shell>
    )
  }

  return (
    <Shell className="container">
      <PageHeader heading="Dashboard" text="Overview of your Solana wallet and recent activities." />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingWalletData ? (
              <Skeleton className="h-8 w-3/4" />
            ) : isErrorWalletData ? (
              <p className="text-destructive">Error loading value</p>
            ) : (
              <div className="text-2xl font-bold">{formatPrice(totalPortfolioValue)}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingWalletData ? (
              <Skeleton className="h-8 w-1/2" />
            ) : isErrorWalletData ? (
              <p className="text-destructive">Error loading tokens</p>
            ) : (
              <div className="text-2xl font-bold">{walletData?.balances.length || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingTransactions ? (
              <Skeleton className="h-8 w-1/2" />
            ) : isErrorTransactions ? (
              <p className="text-destructive">Error loading transactions</p>
            ) : (
              <div className="text-2xl font-bold">{transactionsData?.transactions.length || 0}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <PortfolioValueChart data={walletData?.portfolioHistory || []} isLoading={isLoadingWalletData} />

        <Card>
          <CardHeader>
            <CardTitle>Top Tokens by Value</CardTitle>
            <CardDescription>Your most valuable token holdings.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingWalletData ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            ) : isErrorWalletData ? (
              <p className="text-destructive">Error loading top tokens.</p>
            ) : topTokens.length === 0 ? (
              <p className="text-muted-foreground">No valuable tokens found.</p>
            ) : (
              <div className="space-y-4">
                {topTokens.map((token) => (
                  <div key={token.mint.toBase58()} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {token.logoURI && (
                        <img
                          src={token.logoURI || "/placeholder.svg"}
                          alt={token.symbol}
                          className="h-6 w-6 rounded-full"
                        />
                      )}
                      <span className="font-medium">{token.symbol}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm">{formatNumber(token.balance, token.decimals)}</p>
                      <p className="text-muted-foreground text-xs">{formatPrice(token.valueUsd)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest transactions on the Solana blockchain.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row">
            <Input
              placeholder="Search by signature..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Select
              value={transactionType}
              onValueChange={(value) => setTransactionType(value as TransactionType | "all")}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
                <SelectItem value="swap">Swap</SelectItem>
                <SelectItem value="mint">Mint</SelectItem>
                <SelectItem value="unknown">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isLoadingTransactions ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-[60px] w-full" />
              ))}
            </div>
          ) : isErrorTransactions ? (
            <p className="text-destructive">Error loading transactions.</p>
          ) : (
            <RecentTransactionsTable
              transactions={transactionsData?.transactions || []}
              currentPage={currentPage}
              totalPages={transactionsData?.totalPages || 0}
              onPageChange={setCurrentPage}
            />
          )}
        </CardContent>
      </Card>
    </Shell>
  )
}
