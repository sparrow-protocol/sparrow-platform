import { PageHeader } from "@/components/page-header"
import { Shell } from "@/components/shell"
import { Skeleton } from "@/components/ui/skeleton"

export default function TransactionDetailsLoading() {
  return (
    <Shell className="container max-w-3xl">
      <PageHeader heading="Loading Transaction Details..." text={<Skeleton className="h-6 w-48" />} />

      <div className="space-y-6">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[150px] w-full" />
      </div>
    </Shell>
  )
}
