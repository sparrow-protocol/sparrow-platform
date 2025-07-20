import { generateText, streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { CoreMessage } from "ai"
import { FAL_KEY } from "@/app/lib/constants"
import fal from "@fal-ai/serverless"

export async function generateAIResponse(messages: CoreMessage[]) {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    messages,
  })
  return text
}

export async function streamAIResponse(messages: CoreMessage[]) {
  const result = await streamText({
    model: openai("gpt-4o"),
    messages,
  })
  return result.toReadableStream()
}

export async function generateImageWithFal(prompt: string) {
  if (!FAL_KEY) {
    throw new Error("FAL_KEY is not set. Please set it in your environment variables.")
  }

  try {
    const result = await fal.subscribe("fal-ai/stable-diffusion-v3-medium", {
      input: {
        prompt,
        num_inference_steps: 25,
        guidance_scale: 7.5,
        seed: 0,
        sync_mode: true,
      },
      logs: true,
      onResult: (r: any) => {
        if (r.images && r.images.length > 0) {
          console.log("Image generated:", r.images[0].url)
        }
      },
    })

    if (result.images && result.images.length > 0) {
      return result.images[0].url
    } else {
      throw new Error("No image was generated.")
    }
  } catch (error) {
    console.error("Error generating image with Fal:", error)
    throw error
  }
}
