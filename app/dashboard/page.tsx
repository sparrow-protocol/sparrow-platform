import { Suspense } from "react"
import DashboardClientPage from "./DashboardClientPage"
import DashboardLoading from "./loading"

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardClientPage />
    </Suspense>
  )
}
