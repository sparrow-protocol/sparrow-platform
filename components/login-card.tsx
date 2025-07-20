"use client"

import { usePrivy } from "@privy-io/react-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function LoginCard() {
  const { login, authenticated } = usePrivy()
  const router = useRouter()

  useEffect(() => {
    if (authenticated) {
      router.push("/dashboard")
    }
  }, [authenticated, router])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome to Sparrow</CardTitle>
        <CardDescription>Login to access your Solana DeFi dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={login} className="w-full">
          Login with Privy
        </Button>
      </CardContent>
    </Card>
  )
}
