"use client"

import * as React from "react"
import type { CarouselApi } from "@/components/ui/carousel"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Alice Johnson",
    handle: "@alicej",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    text: "This platform revolutionized my DeFi experience! The swaps are incredibly fast and the interface is so intuitive.",
  },
  {
    name: "Bob Williams",
    handle: "@bobw",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    text: "I love the real-time portfolio tracking. It helps me stay on top of my investments effortlessly.",
  },
  {
    name: "Charlie Brown",
    handle: "@charlieb",
    avatar: "/placeholder-user.jpg",
    rating: 4,
    text: "Secure wallet integration is a huge plus. I feel much safer managing my assets here.",
  },
  {
    name: "Diana Prince",
    handle: "@dianap",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    text: "The best Solana DeFi app I've used so far. Highly recommend for both beginners and advanced users.",
  },
  {
    name: "Eve Adams",
    handle: "@evee",
    avatar: "/placeholder-user.jpg",
    rating: 4,
    text: "Great features and constantly improving. Looking forward to more updates!",
  },
]

export function LLMCarousel() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <section className="py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Users Say</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Hear from our community about their experience with Sparrow.
          </p>
        </div>
        <Carousel setApi={setApi} className="w-full max-w-3xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index}>
                <Card>
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <Avatar className="h-20 w-20 mb-4">
                      <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="text-lg font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground mb-2">{testimonial.handle}</p>
                    <div className="flex mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div className="py-2 text-center text-sm text-muted-foreground">
          Slide {current} of {count}
        </div>
      </div>
    </section>
  )
}
