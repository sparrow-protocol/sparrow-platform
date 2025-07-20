import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { LLMCarousel } from "@/components/llm-carousel"
import { CallToAction } from "@/components/call-to-action"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <LLMCarousel />
        <CallToAction />
      </main>
      <SiteFooter />
    </div>
  )
}
