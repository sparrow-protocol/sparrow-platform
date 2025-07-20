import { getTransactionBySignature } from "@/db/queries"
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header"
import { Shell } from "@/components/shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatAddress } from "@/app/lib/format/address"
import { formatDateTime } from "@/app/lib/format/date"
import { formatPrice } from "@/app/lib/format/price"
import { notFound } from "next/navigation"

export const metadata = {
  title: "Transaction Details",
  description: "View details of a specific blockchain transaction.",
}

export default async function TransactionDetailPage({ params }: { params: { signature: string } }) {
  const transaction = await getTransactionBySignature(params.signature)

  if (!transaction) {
    notFound()
  }

  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading>Transaction Details</PageHeaderHeading>
        <PageHeaderDescription>
          Details for transaction: {formatAddress(transaction.signature, 12)}
        </PageHeaderDescription>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="font-medium">Signature:</div>
            <div>{transaction.signature}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="font-medium">Type:</div>
            <div>{transaction.type}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="font-medium">Amount:</div>
            <div>{transaction.amount ? formatPrice(transaction.amount) : "N/A"}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="font-medium">Timestamp:</div>
            <div>{formatDateTime(transaction.timestamp)}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="font-medium">From Address:</div>
            <div>{transaction.fromAddress}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="font-medium">To Address:</div>
            <div>{transaction.toAddress}</div>
          </div>
          {transaction.fee && (
            <div className="grid grid-cols-2 gap-2">
              <div className="font-medium">Fee:</div>
              <div>{formatPrice(transaction.fee)}</div>
            </div>
          )}
          {transaction.status && (
            <div className="grid grid-cols-2 gap-2">
              <div className="font-medium">Status:</div>
              <div>{transaction.status}</div>
            </div>
          )}
          {transaction.blockNumber && (
            <div className="grid grid-cols-2 gap-2">
              <div className="font-medium">Block Number:</div>
              <div>{transaction.blockNumber}</div>
            </div>
          )}
          {transaction.slot && (
            <div className="grid grid-cols-2 gap-2">
              <div className="font-medium">Slot:</div>
              <div>{transaction.slot}</div>
            </div>
          )}
          {transaction.memo && (
            <div className="grid grid-cols-2 gap-2">
              <div className="font-medium">Memo:</div>
              <div>{transaction.memo}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </Shell>
  )
}
