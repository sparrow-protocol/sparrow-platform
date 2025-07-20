import { PageHeader } from "@/components/page-header"
import { Shell } from "@/components/shell"
import { SwapForm } from "@/components/swap/swap-form"

export default function SwapPage() {
  return (
    <Shell className="container max-w-screen-md">
      <PageHeader
        title="Swap Tokens"
        description="Swap tokens on the Solana blockchain powered by Jupiter Aggregator."
      />
      <SwapForm />
    </Shell>
  )
}
