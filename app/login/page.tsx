"use client"

import { useEffect } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { ready, authenticated, login } = usePrivy()

  useEffect(() => {
    if (ready && authenticated) {
      router.push("/dashboard")
    }
  }, [ready, authenticated, router])

  if (!ready) {
    return (
      <div className="flex min-h-[calc(100vh-var(--site-header-height))] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-var(--site-header-height))] items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to Sparrow</CardTitle>
          <CardDescription>Log in to manage your Solana DeFi assets.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Button onClick={login} className="w-full">
            Log in with Privy
          </Button>
          <p className="text-sm text-muted-foreground">
            By logging in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
