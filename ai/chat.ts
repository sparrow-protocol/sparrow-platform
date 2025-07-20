"use server"

import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createStreamableValue } from "ai/rsc"
import { getAuthenticatedUser } from "@/app/lib/auth/auth"
import { getUserStats } from "@/server/actions/user"
import { getJupiterPrice } from "@/app/lib/jupiter/jupiter-api"
import { getTokenPrice } from "@/app/lib/defi-api"
import { formatPrice } from "@/app/lib/format/price"
import { getJupiterTokenByMint } from "@/app/lib/jupiter/jupiter-token"
import { PublicKey } from "@solana/web3.js"

export async function chat(input: string) {
  const user = await getAuthenticatedUser()
  const stream = createStreamableValue()

  // Example tool definitions
  const tools = {
    getUserStats: {
      description: "Get statistics about the current user's activity.",
      parameters: {
        type: "object",
        properties: {},
      },
      execute: async () => {
        const stats = await getUserStats()
        return `User Stats: Total Transactions: ${stats.totalTransactions}, Total Value Swapped: ${stats.totalValueSwapped}, Member Since: ${stats.memberSince}`
      },
    },
    getTokenPrice: {
      description: "Get the current price of a Solana token.",
      parameters: {
        type: "object",
        properties: {
          mintAddress: {
            type: "string",
            description: "The mint address of the Solana token.",
          },
        },
        required: ["mintAddress"],
      },
      execute: async ({ mintAddress }: { mintAddress: string }) => {
        try {
          // Validate if it's a valid Solana public key
          new PublicKey(mintAddress)
        } catch (e) {
          return "Invalid Solana mint address provided."
        }

        const price = await getTokenPrice(mintAddress)
        const tokenInfo = await getJupiterTokenByMint(mintAddress)

        if (price !== null) {
          return `The current price of ${tokenInfo?.symbol || mintAddress} is ${formatPrice(price)} USD.`
        } else {
          return `Could not fetch price for token with mint address ${mintAddress}.`
        }
      },
    },
    getJupiterTokenPrice: {
      description: "Get the current price of a token listed on Jupiter.",
      parameters: {
        type: "object",
        properties: {
          mintAddress: {
            type: "string",
            description: "The mint address of the token.",
          },
        },
        required: ["mintAddress"],
      },
      execute: async ({ mintAddress }: { mintAddress: string }) => {
        try {
          // Validate if it's a valid Solana public key
          new PublicKey(mintAddress)
        } catch (e) {
          return "Invalid Solana mint address provided."
        }

        const price = await getJupiterPrice(mintAddress)
        const tokenInfo = await getJupiterTokenByMint(mintAddress)

        if (price !== null) {
          return `The current Jupiter price of ${tokenInfo?.symbol || mintAddress} is ${formatPrice(price)} USD.`
        } else {
          return `Could not fetch Jupiter price for token with mint address ${mintAddress}.`
        }
      },
    },
  }
  ;(async () => {
    const { text, toolResults } = await streamText({
      model: openai("gpt-4o"), // Using OpenAI model
      messages: [{ role: "user", content: input }],
      tools,
    })

    stream.update(text)

    for await (const toolCall of toolResults) {
      const output = await toolCall.execute()
      stream.update(output)
    }

    stream.done()
  })()

  return stream.value
}
