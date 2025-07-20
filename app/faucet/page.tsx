import { PageHeader } from "@/components/page-header"
import { Shell } from "@/components/shell"
import { FaucetCard } from "@/components/faucet/faucet-card"

export default function FaucetPage() {
  return (
    <Shell className="container max-w-xl">
      <PageHeader
        heading="Token Faucet"
        text="Get free test tokens on Solana Devnet for development and testing purposes."
      />
      <FaucetCard />
    </Shell>
  )
}
