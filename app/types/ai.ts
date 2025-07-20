import type { Message } from "ai"
import type { CoreMessage } from "ai"

export type AIModel = {
  name: string
  provider: string
  description: string
}

export interface AIChatMessage {
  role: "user" | "assistant" | "system" | "tool"
  content: string
}

export interface AIChatResponse {
  text: string
  finishReason: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: Message[]
  sharePath?: string
}

export type ChatCompletionRequestMessage = CoreMessage

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>

export type Model = {
  id: string
  name: string
  provider: string
  description: string
}
