import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Transaction } from "@/app/types/transactions"
import { formatAddress, formatDate, formatNumber } from "@/app/lib/format"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

interface RecentTransactionsTableProps {
  transactions: Transaction[]
}

export function RecentTransactionsTable({ transactions }: RecentTransactionsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Token</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Signature</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx) => (
          <TableRow key={tx.signature}>
            <TableCell className="capitalize">{tx.type}</TableCell>
            <TableCell>
              {tx.token && (
                <div className="flex items-center gap-2">
                  {tx.token.logoURI && (
                    <Image
                      src={tx.token.logoURI || "/placeholder.svg"}
                      alt={tx.token.symbol}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                  )}
                  <span>{tx.token.symbol}</span>
                </div>
              )}
            </TableCell>
            <TableCell>{formatNumber(tx.amount, tx.token?.decimals || 0)}</TableCell>
            <TableCell>{formatAddress(tx.from)}</TableCell>
            <TableCell>{formatAddress(tx.to)}</TableCell>
            <TableCell>{formatDate(tx.timestamp)}</TableCell>
            <TableCell>
              <Badge
                variant={tx.status === "success" ? "default" : tx.status === "failed" ? "destructive" : "secondary"}
              >
                {tx.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Link href={`/transactions/${tx.signature}`} className="text-blue-500 hover:underline">
                {formatAddress(tx.signature)}
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
