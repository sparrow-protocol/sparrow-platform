import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNumber } from "@/app/lib/format/number"
import { getWalletBalances } from "@/app/lib/solana/wallet-balances"
import { getPortfolioHistory } from "@/app/lib/solana/portfolio-history"
import { RecentTransactionsTable } from "@/components/dashboard/recent-transactions-table"
import { Chart } from "@/components/ui/chart"
import { getTransactions } from "@/db/queries"
import { getUserId } from "@/app/lib/auth/auth"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Dashboard",
  description: "Your personal crypto dashboard.",
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: {
    query?: string
    page?: string
    type?: string
  }
}) {
  const userId = await getUserId()
  if (!userId) {
    redirect("/login")
  }

  const query = searchParams?.query || ""
  const currentPage = Number(searchParams?.page) || 1
  const transactionType = searchParams?.type || "all"

  const [walletBalances, portfolioHistory, transactionsData] = await Promise.all([
    getWalletBalances(userId),
    getPortfolioHistory(userId),
    getTransactions(userId, currentPage, query, transactionType),
  ])

  const totalPortfolioValue = walletBalances.reduce((sum, balance) => sum + balance.usdValue, 0)

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${formatNumber(totalPortfolioValue, 2)}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wallet Balances</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {walletBalances.length > 0 ? (
                  walletBalances.map((balance) => (
                    <div key={balance.mintAddress} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {balance.icon && (
                          <img
                            src={balance.icon || "/placeholder.svg"}
                            alt={balance.symbol}
                            className="h-5 w-5 rounded-full"
                          />
                        )}
                        <span>{balance.symbol}</span>
                      </div>
                      <div className="text-sm font-medium">
                        {formatNumber(balance.balance, 4)} (${formatNumber(balance.usdValue, 2)})
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No tokens found.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader className="px-7">
            <CardTitle>Portfolio Historical Value</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading chart...</div>}>
              <Chart data={portfolioHistory} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
      <Card className="lg:col-span-1">
        <CardHeader className="px-7">
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading transactions...</div>}>
            <RecentTransactionsTable
              transactions={transactionsData.transactions}
              totalPages={transactionsData.totalPages}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
