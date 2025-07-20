import { FaucetCard } from "@/components/faucet/faucet-card"
import { PageHeader } from "@/components/page-header"
import { Shell } from "@/components/shell"

export default function FaucetPage() {
  return (
    <Shell className="container max-w-screen-md">
      <PageHeader title="Faucet" description="Get free Devnet SOL for testing your applications." />
      <FaucetCard />
    </Shell>
  )
}
