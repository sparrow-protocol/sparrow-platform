"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import type { CarouselApi } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { SparklesIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { generateChatResponse } from "@/ai/chat"

interface LLMCarouselProps {
  prompts: string[]
}

export function LLMCarousel({ prompts }: LLMCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [promptIndex, setPromptIndex] = React.useState(0)
  const [completion, setCompletion] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  React.useEffect(() => {
    if (prompts.length > 0) {
      setPromptIndex(current - 1)
    }
  }, [current, prompts.length])

  const handleGenerate = async () => {
    if (prompts[promptIndex]) {
      setIsLoading(true)
      try {
        const response = await generateChatResponse(prompts[promptIndex])
        setCompletion(response)
      } catch (error) {
        console.error("Error generating response:", error)
        setCompletion("Sorry, I couldn't generate a response.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto py-8">
      <Carousel setApi={setApi} className="w-full max-w-xl">
        <CarouselContent>
          {prompts.map((prompt, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-2xl font-semibold text-center">{prompt}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="py-2 text-center text-sm text-gray-500 dark:text-gray-400">
        Prompt {current} of {prompts.length}
      </div>
      <Button onClick={handleGenerate} disabled={isLoading} className="mt-4">
        {isLoading ? (
          <>
            <SparklesIcon className="mr-2 h-4 w-4 animate-pulse" /> Generating...
          </>
        ) : (
          <>
            <SparklesIcon className="mr-2 h-4 w-4" /> Generate Response
          </>
        )}
      </Button>
      <div className="w-full max-w-xl mt-6">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
        ) : (
          completion && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">AI Response:</h3>
                <p className="text-gray-700 dark:text-gray-300">{completion}</p>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  )
}
