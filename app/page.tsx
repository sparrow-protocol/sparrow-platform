import { CallToAction } from "@/components/call-to-action"
import { FeaturesSection } from "@/components/features-section"
import { HeroSection } from "@/components/hero-section"
import { LLMCarousel } from "@/components/llm-carousel"
import { FAQSection } from "@/components/faq-section"

export default function IndexPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <LLMCarousel />
      <FAQSection />
      <CallToAction />
    </>
  )
}
