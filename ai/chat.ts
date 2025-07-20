import { createAI, getMutableAIState } from "ai/rsc"
import { generateText, streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createStreamableValue } from "ai/rsc"

export async function submitUserMessage(content: string) {
  "use server"

  const aiState = getMutableAIState()

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: Date.now(),
        role: "user",
        content,
      },
    ],
  })

  const ui = createStreamableValue()
  const text = createStreamableValue()
  ;(async () => {
    const result = await streamText({
      model: openai("gpt-4o"),
      messages: [
        ...aiState.get().messages.map((message: any) => ({
          role: message.role,
          content: message.content,
          name: message.name,
        })),
      ],
      tools: {
        // get_current_weather: {
        //   description: 'Get the current weather for a city',
        //   parameters: z.object({
        //     city: z.string().describe('The city to get the weather for'),
        //   }),
        //   execute: async ({ city }) => {
        //     return {
        //       city,
        //       temperature: 22,
        //       unit: 'celsius',
        //     }
        //   },
        // },
      },
    })

    for await (const delta of result.fullStream) {
      if (delta.type === "text-delta") {
        text.update(delta.text)
      }
    }

    aiState.update({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: Date.now(),
          role: "assistant",
          content: text.value,
        },
      ],
    })

    ui.done()
    text.done()
  })()

  return {
    id: Date.now(),
    display: ui.value,
  }
}

export async function generateChatResponse(prompt: string): Promise<string> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
    })
    return text
  } catch (error) {
    console.error("Error generating chat response:", error)
    return "I'm sorry, I couldn't generate a response at this time."
  }
}

export async function streamChatResponse(prompt: string) {
  try {
    const result = await streamText({
      model: openai("gpt-4o"),
      prompt: prompt,
    })
    return result.textStream
  } catch (error) {
    console.error("Error streaming chat response:", error)
    throw error
  }
}

export const AI = createAI({
  actions: {
    submitUserMessage,
    generateChatResponse,
    streamChatResponse,
  },
  initialAIState: {
    chatId: Date.now(),
    messages: [],
  },
  initialUIState: [],
})
