import { HeroSection } from "@/components/hero-section"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FeaturesSection } from "@/components/features-section"
import { RocketIcon, WalletIcon, BarChartIcon, RefreshCcwIcon } from "lucide-react"
import { CallToAction } from "@/components/call-to-action"
import { LLMCarousel } from "@/components/llm-carousel"
import { FAQSection } from "@/components/faq-section"

export default function Home() {
  return (
    <>
      <HeroSection
        title="Sparrow: Your Solana DeFi Hub"
        description="Experience seamless DeFi on Solana with Sparrow. Swap tokens, manage your portfolio, and explore new opportunities with ease."
      >
        <div className="space-x-4">
          <Button asChild>
            <Link href="/dashboard">Launch App</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/learn-more">Learn More</Link>
          </Button>
        </div>
      </HeroSection>

      <FeaturesSection
        features={[
          {
            icon: <WalletIcon className="h-8 w-8" />,
            title: "Wallet Management",
            description: "Securely manage your Solana assets and track your portfolio in real-time.",
          },
          {
            icon: <RefreshCcwIcon className="h-8 w-8" />,
            title: "Token Swaps",
            description: "Execute lightning-fast token swaps powered by Jupiter Aggregator.",
          },
          {
            icon: <BarChartIcon className="h-8 w-8" />,
            title: "Portfolio Analytics",
            description: "Gain insights into your portfolio performance with detailed charts and history.",
          },
          {
            icon: <RocketIcon className="h-8 w-8" />,
            title: "Solana Pay Integration",
            description: "Send and receive payments effortlessly using Solana Pay.",
          },
        ]}
      />

      <section className="py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Explore AI Models</h2>
          <LLMCarousel />
        </div>
      </section>

      <FAQSection
        faqs={[
          {
            question: "What is Solana?",
            answer: "Solana is a high-performance blockchain known for its speed and low transaction costs.",
          },
          {
            question: "How do I connect my wallet?",
            answer: "You can connect your Phantom wallet or use the embedded Privy wallet for seamless access.",
          },
          {
            question: "What is Jupiter Aggregator?",
            answer:
              "Jupiter is a leading DEX aggregator on Solana, providing the best swap rates by routing through various liquidity sources.",
          },
          {
            question: "Is my data secure?",
            answer:
              "Yes, we prioritize your security. All sensitive data is encrypted, and we use Privy for secure authentication.",
          },
        ]}
      />

      <CallToAction
        title="Ready to get started?"
        description="Join Sparrow today and take control of your Solana DeFi experience."
        buttonText="Launch App"
        buttonHref="/dashboard"
      />
    </>
  )
}
