import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Rocket, ShieldCheck, TrendingUp } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Powerful Features for Your DeFi Journey</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Sparrow offers a suite of tools designed to simplify your Solana DeFi experience.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
          <Card>
            <CardHeader>
              <Rocket className="h-8 w-8 text-primary" />
              <CardTitle className="mt-2">Blazing Fast Swaps</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Execute token swaps instantly with minimal fees, powered by Jupiter Aggregator.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <ShieldCheck className="h-8 w-8 text-primary" />
              <CardTitle className="mt-2">Secure Wallet Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connect your existing Solana wallet or use our secure embedded wallet for seamless transactions.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-primary" />
              <CardTitle className="mt-2">Real-time Portfolio Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor your asset performance and transaction history with comprehensive insights.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
