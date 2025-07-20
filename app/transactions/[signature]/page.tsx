import { Suspense } from "react"
import { PageHeader } from "@/components/page-header"
import { Shell } from "@/components/shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchTransactionDetails } from "@/app/lib/defi-api"
import { formatAddress } from "@/app/lib/format/address"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import TransactionDetailsLoading from "./loading"
import type { Instruction } from "@/app/types/transactions"

interface TransactionDetailsPageProps {
  params: {
    signature: string
  }
}

export default async function TransactionDetailsPage({ params }: TransactionDetailsPageProps) {
  const { signature } = params
  const transaction = await fetchTransactionDetails(signature)

  if (!transaction) {
    return (
      <Shell className="container">
        <PageHeader heading="Transaction Not Found" text={`No details found for signature: ${signature}`} />
      </Shell>
    )
  }

  return (
    <Suspense fallback={<TransactionDetailsLoading />}>
      <Shell className="container max-w-3xl">
        <PageHeader heading="Transaction Details" text={formatAddress(signature, 12)} />

        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Status:</span>
              <Badge variant={transaction.status === "Failed" ? "destructive" : "default"}>{transaction.status}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Type:</span>
              <Badge>{transaction.type.replace(/_/g, " ")}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Timestamp:</span>
              <span>{transaction.timestamp}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Block:</span>
              <span>{transaction.block}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Fee:</span>
              <span>{transaction.fee} SOL</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Slot:</span>
              <span>{transaction.slot}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Recent Blockhash:</span>
              <span className="font-mono text-sm">{formatAddress(transaction.recentBlockhash, 8)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {transaction.instructions.length === 0 ? (
              <p className="text-muted-foreground">No instructions found for this transaction.</p>
            ) : (
              transaction.instructions.map((instruction: Instruction, index: number) => (
                <div key={index} className="rounded-md border p-4">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>Program ID:</span>
                    <span>{formatAddress(instruction.programId)}</span>
                  </div>
                  {"program" in instruction && (
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span>Program:</span>
                      <span>{instruction.program}</span>
                    </div>
                  )}
                  {"type" in instruction && (
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span>Instruction Type:</span>
                      <span>{instruction.type}</span>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="text-sm">
                    <p className="font-medium">Accounts:</p>
                    <ul className="list-disc pl-5">
                      {instruction.accounts.map((account, accIndex) => (
                        <li key={accIndex} className="font-mono text-xs">
                          {formatAddress(typeof account === "string" ? account : account.toBase58())}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {"data" in instruction && instruction.data && (
                    <>
                      <Separator className="my-2" />
                      <div className="text-sm">
                        <p className="font-medium">Data:</p>
                        <p className="break-all font-mono text-xs">{instruction.data}</p>
                      </div>
                    </>
                  )}
                  {"info" in instruction && instruction.info && (
                    <>
                      <Separator className="my-2" />
                      <div className="text-sm">
                        <p className="font-medium">Info:</p>
                        <pre className="overflow-x-auto rounded-md bg-muted p-2 font-mono text-xs">
                          {JSON.stringify(instruction.info, null, 2)}
                        </pre>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Balances</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-md font-medium">Pre-Balances (Lamports)</h3>
            <ul className="list-disc pl-5 text-sm">
              {transaction.preBalances?.map((balance, index) => (
                <li key={index}>
                  {formatAddress(transaction.accountKeys[index] || "Unknown")}: {balance}
                </li>
              ))}
            </ul>
            <h3 className="text-md font-medium">Post-Balances (Lamports)</h3>
            <ul className="list-disc pl-5 text-sm">
              {transaction.postBalances?.map((balance, index) => (
                <li key={index}>
                  {formatAddress(transaction.accountKeys[index] || "Unknown")}: {balance}
                </li>
              ))}
            </ul>
            <Separator className="my-4" />
            <h3 className="text-md font-medium">Pre-Token Balances</h3>
            {transaction.preTokenBalances?.length === 0 ? (
              <p className="text-muted-foreground text-sm">No pre-token balances.</p>
            ) : (
              <ul className="list-disc pl-5 text-sm">
                {transaction.preTokenBalances?.map((tokenBalance, index) => (
                  <li key={index}>
                    {formatAddress(tokenBalance.owner || "Unknown")} - {formatAddress(tokenBalance.mint || "Unknown")}:{" "}
                    {tokenBalance.uiTokenAmount.uiAmount} (decimals: {tokenBalance.uiTokenAmount.decimals})
                  </li>
                ))}
              </ul>
            )}
            <h3 className="text-md font-medium">Post-Token Balances</h3>
            {transaction.postTokenBalances?.length === 0 ? (
              <p className="text-muted-foreground text-sm">No post-token balances.</p>
            ) : (
              <ul className="list-disc pl-5 text-sm">
                {transaction.postTokenBalances?.map((tokenBalance, index) => (
                  <li key={index}>
                    {formatAddress(tokenBalance.owner || "Unknown")} - {formatAddress(tokenBalance.mint || "Unknown")}:{" "}
                    {tokenBalance.uiTokenAmount.uiAmount} (decimals: {tokenBalance.uiTokenAmount.decimals})
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Log Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {transaction.logMessages?.length === 0 ? (
              <p className="text-muted-foreground">No log messages for this transaction.</p>
            ) : (
              <ul className="list-disc pl-5 text-sm">
                {transaction.logMessages?.map((log, index) => (
                  <li key={index} className="font-mono text-xs">
                    {log}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </Shell>
    </Suspense>
  )
}
