"use client"

import type React from "react"
import { PrivyProvider } from "@privy-io/react-auth"
import { useRouter } from "next/navigation"
import { PRIVY_APP_ID } from "@/app/lib/constants"

export function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      onSuccess={(user) => {
        console.log("Privy login success:", user)
        router.push("/dashboard")
      }}
      config={{
        appearance: {
          theme: "light", // or "dark"
          accentColor: "#6789EE", // A shade of blue/purple
          logo: "/images/sparrow-logo-black.png", // Path to your logo
        },
        loginMethods: ["email", "wallet"], // Allow email and wallet logins
        embeddedWallets: {
          createOnLogin: "users-without-wallets", // Create embedded wallet for users without external wallets
        },
        // Add any other Privy configuration here
      }}
    >
      {children}
    </PrivyProvider>
  )
}
