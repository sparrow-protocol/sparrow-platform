"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { formatAddress } from "@/app/lib/format/address"
import { formatDateTime } from "@/app/lib/format/date"
import { formatPrice } from "@/app/lib/format/price"
import type { Transaction, TransactionType } from "@/app/types/transactions"
import Link from "next/link"

interface RecentTransactionsTableProps {
  transactions: Transaction[]
  totalPages: number
}

export function RecentTransactionsTable({ transactions, totalPages }: RecentTransactionsTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "")
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1)
  const [selectedType, setSelectedType] = useState<TransactionType | "all">(
    (searchParams.get("type") as TransactionType | "all") || "all",
  )

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", currentPage.toString())
    if (searchQuery) {
      params.set("query", searchQuery)
    } else {
      params.delete("query")
    }
    if (selectedType !== "all") {
      params.set("type", selectedType)
    } else {
      params.delete("type")
    }
    router.push(`?${params.toString()}`, { scroll: false })
  }, [currentPage, searchQuery, selectedType, router, searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page on new search
  }

  const handleTypeChange = (value: string) => {
    setSelectedType(value as TransactionType | "all")
    setCurrentPage(1) // Reset to first page on type change
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          placeholder="Search by signature..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select onValueChange={handleTypeChange} value={selectedType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="transfer">Transfer</SelectItem>
            <SelectItem value="swap">Swap</SelectItem>
            <SelectItem value="mint">Mint</SelectItem>
            <SelectItem value="unknown">Unknown</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit">Search</Button>
      </form>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Signature</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TableRow key={transaction.signature}>
                  <TableCell className="font-medium">
                    <Link href={`/transactions/${transaction.signature}`} className="hover:underline">
                      {formatAddress(transaction.signature, 8)}
                    </Link>
                  </TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>{transaction.amount ? formatPrice(transaction.amount) : "N/A"}</TableCell>
                  <TableCell>{formatDateTime(transaction.timestamp)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                aria-disabled={currentPage <= 1}
                tabIndex={currentPage <= 1 ? -1 : undefined}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <Button
                  variant={currentPage === index + 1 ? "default" : "outline"}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Button>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                aria-disabled={currentPage >= totalPages}
                tabIndex={currentPage >= totalPages ? -1 : undefined}
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
