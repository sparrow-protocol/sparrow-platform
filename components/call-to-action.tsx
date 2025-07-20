import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function CallToAction() {
  return (
    <Card className="w-full max-w-4xl mx-auto text-center">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Ready to get started?</CardTitle>
        <CardDescription className="mt-2 text-lg">
          Join Sparrow today and take control of your Solana assets.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/login">Sign Up Now</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">Learn More</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
