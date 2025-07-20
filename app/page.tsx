import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { LLMCarousel } from "@/components/llm-carousel"
import { CallToAction } from "@/components/call-to-action"

export default function Page() {
  return (
    <main className="flex-1">
      <HeroSection />
      <FeaturesSection />
      <LLMCarousel />
      <CallToAction />
    </main>
  )
}
