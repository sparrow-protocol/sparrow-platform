"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useWallets } from "@privy-io/react-auth/wallets"
import { useQuery } from "@tanstack/react-query"
import { Connection, PublicKey } from "@solana/web3.js"
import { getSolanaWalletBalances, getSolanaPortfolioHistory, getSolanaTransactionHistory } from "@/app/lib/defi-api"
import { MOCK_WALLET_BALANCES, MOCK_TRANSACTIONS, MOCK_CHART_DATA } from "@/app/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { formatPrice } from "@/app/lib/format/price"
import { formatNumber } from "@/app/lib/format/number"
import { RecentTransactionsTable } from "@/components/dashboard/recent-transactions-table"
import type { ChartPeriod } from "@/app/types/chart"
import { useState } from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Skeleton } from "@/components/ui/skeleton"

const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL!)

export function DashboardClientPage() {
  const { user } = usePrivy()
  const { wallets } = useWallets()
  const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy")
  const publicKey = embeddedWallet ? new PublicKey(embeddedWallet.address) : null

  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("24h")

  const { data: walletBalances, isLoading: isLoadingBalances } = useQuery({
    queryKey: ["walletBalances", publicKey?.toBase58()],
    queryFn: () => (publicKey ? getSolanaWalletBalances(publicKey) : []),
    enabled: !!publicKey,
    initialData: MOCK_WALLET_BALANCES, // Use mock data as initial data
  })

  const { data: transactionHistory, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["transactionHistory", publicKey?.toBase58()],
    queryFn: () => (publicKey ? getSolanaTransactionHistory(publicKey) : []),
    enabled: !!publicKey,
    initialData: MOCK_TRANSACTIONS, // Use mock data as initial data
  })

  const { data: portfolioHistory, isLoading: isLoadingPortfolio } = useQuery({
    queryKey: ["portfolioHistory", publicKey?.toBase58(), chartPeriod],
    queryFn: () => (publicKey ? getSolanaPortfolioHistory(publicKey, chartPeriod) : []),
    enabled: !!publicKey,
    initialData: MOCK_CHART_DATA[chartPeriod], // Use mock data as initial data
  })

  const totalPortfolioValue = walletBalances.reduce((sum, balance) => sum + balance.value, 0)

  const chartConfig = {
    value: {
      label: "Value",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingBalances ? (
              <Skeleton className="h-10 w-3/4" />
            ) : (
              <p className="text-4xl font-bold">{formatPrice(totalPortfolioValue, "USD")}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wallet Balances</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingBalances ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : (
              <ul className="space-y-2">
                {walletBalances.map((balance) => (
                  <li key={balance.mint.address} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {balance.mint.logoURI && (
                        <img
                          src={balance.mint.logoURI || "/placeholder.svg"}
                          alt={balance.mint.symbol}
                          className="h-6 w-6 rounded-full"
                        />
                      )}
                      <span>
                        {balance.mint.name} ({balance.mint.symbol})
                      </span>
                    </div>
                    <span>
                      {formatNumber(balance.balance)} {balance.mint.symbol}
                    </span>
                    <span>{formatPrice(balance.value, "USD")}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Portfolio History</CardTitle>
            <ToggleGroup
              type="single"
              value={chartPeriod}
              onValueChange={(value: ChartPeriod) => setChartPeriod(value)}
              className="space-x-1"
            >
              <ToggleGroupItem value="24h">24h</ToggleGroupItem>
              <ToggleGroupItem value="7d">7d</ToggleGroupItem>
              <ToggleGroupItem value="1m">1m</ToggleGroupItem>
              <ToggleGroupItem value="3m">3m</ToggleGroupItem>
              <ToggleGroupItem value="1y">1y</ToggleGroupItem>
              <ToggleGroupItem value="all">All</ToggleGroupItem>
            </ToggleGroup>
          </CardHeader>
          <CardContent>
            {isLoadingPortfolio ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
                <AreaChart data={portfolioHistory}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={30} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Area
                    dataKey="value"
                    type="monotone"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingTransactions ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <RecentTransactionsTable transactions={transactionHistory} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
