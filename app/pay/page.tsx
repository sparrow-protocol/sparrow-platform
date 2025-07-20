import { PageHeader } from "@/components/page-header"
import { Shell } from "@/components/shell"
import { SendPaymentForm } from "@/components/solana-pay/send-payment-form"
import { ReceivePaymentCard } from "@/components/solana-pay/receive-payment-card"

export default function PayPage() {
  return (
    <Shell className="container max-w-3xl">
      <PageHeader heading="Solana Pay" text="Send and receive payments on Solana using SPL tokens." />
      <div className="grid gap-6 md:grid-cols-2">
        <SendPaymentForm />
        <ReceivePaymentCard />
      </div>
    </Shell>
  )
}
