import { PageHeader } from "@/components/page-header"
import { Shell } from "@/components/shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MOCK_TRANSACTIONS } from "@/app/lib/mock-data"
import { formatAddress } from "@/app/lib/format/address"
import { formatTimestamp } from "@/app/lib/format/date"
import { formatNumber } from "@/app/lib/format/number"
import { CopyButton } from "@/components/copy-button"

interface TransactionDetailPageProps {
  params: {
    signature: string
  }
}

export default async function TransactionDetailPage({ params }: TransactionDetailPageProps) {
  // In a real app, you'd fetch a single transaction by signature.
  // For this example, we'll filter from mock data.
  const transaction = MOCK_TRANSACTIONS.find((tx) => tx.signature === params.signature)

  if (!transaction) {
    return (
      <Shell className="container max-w-screen-md">
        <PageHeader title="Transaction Not Found" description="The requested transaction could not be found." />
      </Shell>
    )
  }

  return (
    <Shell className="container max-w-screen-md">
      <PageHeader
        title="Transaction Details"
        description={`Details for transaction: ${formatAddress(transaction.signature)}`}
      />
      <Card>
        <CardHeader>
          <CardTitle>Transaction Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Signature:</span>
            <div className="flex items-center gap-2">
              <span>{formatAddress(transaction.signature, 8)}</span>
              <CopyButton value={transaction.signature} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Type:</span>
            <span>{transaction.type}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Timestamp:</span>
            <span>{formatTimestamp(transaction.timestamp)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Amount:</span>
            <span>
              {formatNumber(transaction.amount)} {transaction.token.symbol}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Token:</span>
            <div className="flex items-center gap-2">
              {transaction.token.logoURI && (
                <img
                  src={transaction.token.logoURI || "/placeholder.svg"}
                  alt={transaction.token.symbol}
                  className="h-5 w-5 rounded-full"
                />
              )}
              <span>
                {transaction.token.name} ({transaction.token.symbol})
              </span>
            </div>
          </div>
          {transaction.from && (
            <div className="flex items-center justify-between">
              <span className="font-medium">From:</span>
              <div className="flex items-center gap-2">
                <span>{formatAddress(transaction.from)}</span>
                <CopyButton value={transaction.from} />
              </div>
            </div>
          )}
          {transaction.to && (
            <div className="flex items-center justify-between">
              <span className="font-medium">To:</span>
              <div className="flex items-center gap-2">
                <span>{formatAddress(transaction.to)}</span>
                <CopyButton value={transaction.to} />
              </div>
            </div>
          )}
          {transaction.fee !== undefined && (
            <div className="flex items-center justify-between">
              <span className="font-medium">Fee:</span>
              <span>{formatNumber(transaction.fee)} SOL</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="font-medium">Status:</span>
            <span
              className={`font-semibold ${transaction.status === "success" ? "text-green-500" : transaction.status === "failed" ? "text-red-500" : "text-yellow-500"}`}
            >
              {transaction.status.toUpperCase()}
            </span>
          </div>
        </CardContent>
      </Card>
    </Shell>
  )
}
