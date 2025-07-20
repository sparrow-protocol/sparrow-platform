import { LoginCard } from "@/components/login-card"
import { PageHeader } from "@/components/page-header"
import { Shell } from "@/components/shell"

export default function LoginPage() {
  return (
    <Shell className="container max-w-screen-md">
      <PageHeader title="Login" description="Access your Solana DeFi dashboard." />
      <LoginCard />
    </Shell>
  )
}
