import Link from "next/link"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"
import { Icons } from "@/components/ui/icons"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">{siteConfig.name}</h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">{siteConfig.description}</p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild>
                <Link href="/dashboard">Get Started</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={siteConfig.links.github} target="_blank" rel="noreferrer">
                  <Icons.gitHub className="mr-2 h-4 w-4" />
                  GitHub
                </Link>
              </Button>
            </div>
          </div>
          <Image
            src="/images/sparrow-3d.png"
            width="600"
            height="600"
            alt="Sparrow 3D"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
          />
        </div>
      </div>
    </section>
  )
}
