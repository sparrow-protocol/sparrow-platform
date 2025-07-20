export interface ChatMessage {
  id: string
  userId: string
  role: "user" | "assistant"
  content: string
  createdAt: Date
}
