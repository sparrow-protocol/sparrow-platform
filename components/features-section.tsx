import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Bot, Wallet, LineChart, Zap, ShieldCheck } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-foreground px-3 py-1 text-sm text-background">Key Features</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything you need for Solana DeFi</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Sparrow Web App provides a comprehensive suite of tools to manage your Solana assets, execute swaps, and
              interact with AI.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
          <Card>
            <CardHeader>
              <DollarSign className="h-8 w-8 text-primary" />
              <CardTitle className="mt-2">Token Swaps</CardTitle>
            </CardHeader>
            <CardContent>Execute seamless token swaps with the best rates powered by Jupiter Aggregator.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Bot className="h-8 w-8 text-primary" />
              <CardTitle className="mt-2">AI Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              Get instant answers and insights about Solana, DeFi, and your portfolio with our integrated AI chatbot.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Wallet className="h-8 w-8 text-primary" />
              <CardTitle className="mt-2">Wallet Management</CardTitle>
            </CardHeader>
            <CardContent>
              Connect your existing Solana wallets or use our embedded wallet solution for easy access.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <LineChart className="h-8 w-8 text-primary" />
              <CardTitle className="mt-2">Portfolio Tracking</CardTitle>
            </CardHeader>
            <CardContent>Monitor your token balances and transaction history in real-time.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-primary" />
              <CardTitle className="mt-2">Solana Pay Integration</CardTitle>
            </CardHeader>
            <CardContent>Send and receive payments effortlessly using Solana Pay.</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <ShieldCheck className="h-8 w-8 text-primary" />
              <CardTitle className="mt-2">Secure & Reliable</CardTitle>
            </CardHeader>
            <CardContent>Built on robust infrastructure with a focus on security and user experience.</CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
