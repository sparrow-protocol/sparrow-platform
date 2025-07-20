import { FaucetCard } from "@/components/faucet/faucet-card"
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header"
import { Shell } from "@/components/shell"

export const metadata = {
  title: "Faucet",
  description: "Get free Devnet SOL for testing purposes.",
}

export default function FaucetPage() {
  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading>Faucet</PageHeaderHeading>
        <PageHeaderDescription>Get free Devnet SOL for testing purposes.</PageHeaderDescription>
      </PageHeader>
      <div className="flex justify-center">
        <FaucetCard />
      </div>
    </Shell>
  )
}
