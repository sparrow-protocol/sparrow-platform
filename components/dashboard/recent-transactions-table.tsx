"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { formatAddress } from "@/app/lib/format/address"
import type { TransactionDetails, TransactionType } from "@/app/types/transactions"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RecentTransactionsTableProps {
  transactions: TransactionDetails[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function RecentTransactionsTable({
  transactions,
  currentPage,
  totalPages,
  onPageChange,
}: RecentTransactionsTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [type, setType] = useState<TransactionType | "all">(
    (searchParams.get("type") as TransactionType | "all") || "all",
  )

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (search) {
      params.set("search", search)
    } else {
      params.delete("search")
    }
    if (type !== "all") {
      params.set("type", type)
    } else {
      params.delete("type")
    }
    params.set("page", currentPage.toString())
    router.push(`?${params.toString()}`)
  }, [search, type, currentPage, router, searchParams])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    onPageChange(1) // Reset to first page on new search
  }

  const handleTypeChange = (value: TransactionType | "all") => {
    setType(value)
    onPageChange(1) // Reset to first page on new filter
  }

  const handlePageChange = (page: number) => {
    onPageChange(page)
  }

  const columns: ColumnDef<TransactionDetails>[] = [
    {
      accessorKey: "signature",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Signature
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <Link href={`/transactions/${row.original.signature}`} className="text-blue-500 hover:underline">
          {formatAddress(row.original.signature)}
        </Link>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type: TransactionType = row.getValue("type")
        let variant: "default" | "secondary" | "destructive" | "outline" = "default"
        switch (type) {
          case "transfer":
            variant = "secondary"
            break
          case "swap":
            variant = "primary" // Assuming primary is a good fit for swaps
            break
          case "mint":
            variant = "outline"
            break
          case "unknown":
          default:
            variant = "destructive"
            break
        }
        return <Badge variant={variant}>{type.replace(/_/g, " ")}</Badge>
      },
    },
    {
      accessorKey: "timestamp",
      header: "Timestamp",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status")
        return <Badge variant={status === "Failed" ? "destructive" : "default"}>{status}</Badge>
      },
    },
  ]

  return (
    <div className="space-y-4">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <Input placeholder="Search by signature..." value={search} onChange={handleSearch} className="flex-1" />
        <Select value={type} onValueChange={handleTypeChange}>
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey as string}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length ? (
              transactions.map((transaction) => (
                <TableRow key={transaction.signature}>
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey as string}>
                      {column.cell
                        ? column.cell({
                            row: { original: transaction, getValue: (key: string) => (transaction as any)[key] } as any,
                          })
                        : (transaction as any)[column.accessorKey as string]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1} />
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <Button variant={currentPage === page ? "outline" : "ghost"} onClick={() => handlePageChange(page)}>
                {page}
              </Button>
            </PaginationItem>
          ))}
          <PaginationNext onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages} />
        </PaginationContent>
      </Pagination>
    </div>
  )
}
