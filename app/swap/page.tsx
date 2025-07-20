import { PageHeader } from "@/components/page-header"
import { Shell } from "@/components/shell"
import { SwapForm } from "@/components/swap/swap-form"

export default function SwapPage() {
  return (
    <Shell className="container max-w-xl">
      <PageHeader
        heading="Token Swap"
        text="Swap tokens on Solana with the best rates powered by Jupiter Aggregator."
      />
      <SwapForm />
    </Shell>
  )
}
