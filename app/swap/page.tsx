import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/page-header"
import { Shell } from "@/components/shell"
import { SwapForm } from "@/components/swap/swap-form"

export default function SwapPage() {
  return (
    <Shell layout="dashboard">
      <PageHeader>
        <PageHeaderHeading>Swap Tokens</PageHeaderHeading>
        <PageHeaderDescription>
          Exchange your Solana tokens with the best rates powered by Jupiter Aggregator.
        </PageHeaderDescription>
      </PageHeader>
      <SwapForm />
    </Shell>
  )
}
