"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from "next/image"

const llms = [
  {
    name: "GPT-4o",
    logo: "/placeholder.svg?height=100&width=100",
    description: "OpenAI's most advanced, multimodal model.",
  },
  {
    name: "Grok",
    logo: "/placeholder.svg?height=100&width=100",
    description: "xAI's conversational AI, designed for humor and insight.",
  },
  {
    name: "Llama 3",
    logo: "/placeholder.svg?height=100&width=100",
    description: "Meta's powerful open-source language model.",
  },
  {
    name: "Mixtral",
    logo: "/placeholder.svg?height=100&width=100",
    description: "Mistral AI's sparse mixture-of-experts model.",
  },
  {
    name: "Claude 3",
    logo: "/placeholder.svg?height=100&width=100",
    description: "Anthropic's family of frontier models.",
  },
]

export function LLMCarousel() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-foreground px-3 py-1 text-sm text-background">
              Powered by Leading AI
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Integrate with the best LLMs</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our AI assistant leverages state-of-the-art large language models to provide accurate and helpful
              responses.
            </p>
          </div>
        </div>
        <div className="mt-12 flex justify-center">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-4xl"
          >
            <CarouselContent>
              {llms.map((llm, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="flex h-full flex-col items-center justify-center p-6 text-center">
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <Image
                          src={llm.logo || "/placeholder.svg"}
                          alt={`${llm.name} logo`}
                          width={100}
                          height={100}
                          className="h-24 w-24 object-contain"
                        />
                      </CardContent>
                      <h3 className="text-xl font-semibold">{llm.name}</h3>
                      <p className="text-sm text-muted-foreground mt-2">{llm.description}</p>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  )
}
