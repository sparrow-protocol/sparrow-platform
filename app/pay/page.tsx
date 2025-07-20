import { PageHeader } from "@/components/page-header"
import { Shell } from "@/components/shell"
import { SendPaymentForm } from "@/components/solana-pay/send-payment-form"
import { ReceivePaymentCard } from "@/components/solana-pay/receive-payment-card"

export default function PayPage() {
  return (
    <Shell className="container max-w-screen-lg">
      <PageHeader title="Solana Pay" description="Send and receive payments on the Solana blockchain." />
      <div className="grid gap-6 md:grid-cols-2">
        <SendPaymentForm />
        <ReceivePaymentCard />
      </div>
    </Shell>
  )
}
