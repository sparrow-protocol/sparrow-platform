import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface FeaturesSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  features: {
    icon: React.ReactNode
    title: string
    description: string
  }[]
}

export function FeaturesSection({ features, className, ...props }: FeaturesSectionProps) {
  return (
    <section className={cn("py-12 md:py-24 lg:py-32", className)} {...props}>
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 text-primary">{feature.icon}</div>
              <CardHeader>
                <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-500 dark:text-gray-400">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
