import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Shell } from "@/components/shell"

export default function TransactionDetailLoading() {
  return (
    <Shell className="container max-w-screen-md">
      <PageHeader title="Transaction Details" description="Loading transaction details..." />
      <Card>
        <CardHeader>
          <CardTitle>Transaction Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-48" />
            </div>
          ))}
        </CardContent>
      </Card>
    </Shell>
  )
}
