import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is Solana?",
    answer:
      "Solana is a high-performance blockchain known for its speed and low transaction costs. It's designed to support decentralized applications (dApps) and crypto projects.",
  },
  {
    question: "How do I swap tokens?",
    answer:
      "You can swap tokens on our platform using the 'Swap' page. We integrate with Jupiter Aggregator to provide the best rates and liquidity.",
  },
  {
    question: "What is Solana Pay?",
    answer:
      "Solana Pay is a decentralized payments protocol that enables direct, peer-to-peer payments using Solana tokens. It offers fast and low-cost transactions.",
  },
  {
    question: "How can I get test tokens?",
    answer:
      "If you're on the devnet, you can use our 'Faucet' feature to receive free test tokens for development and testing purposes.",
  },
  {
    question: "Is my wallet secure?",
    answer:
      "Yes, we use Privy for secure user authentication and wallet management. Your embedded wallet is protected with industry-standard security measures.",
  },
]

export function FAQSection() {
  return (
    <section className="container py-12 lg:py-24">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          Find answers to common questions about Sparrow and Solana DeFi.
        </p>
      </div>
      <div className="mx-auto max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
