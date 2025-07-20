import { PageHeader } from "@/components/page-header"
import { Shell } from "@/components/shell"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <Shell className="container">
      <PageHeader heading="Dashboard" text="Overview of your Solana wallet and recent activities." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[120px] w-full" />
        ))}
      </div>
      <Skeleton className="h-[400px] w-full" />
      <Skeleton className="h-[300px] w-full" />
    </Shell>
  )
}
