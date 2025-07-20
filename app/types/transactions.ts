export type TransactionType = "transfer" | "swap" | "program_interaction" | "unknown"

export type Instruction = {
  programId: string
  program?: string
  type?: string
  info?: any
  data?: string
  accounts?: string[]
}

export type TransactionDetails = {
  signature: string
  timestamp: string
  type: TransactionType
  status: "success" | "failed"
  fee: number // in SOL
  block: number
  slot: number
  recentBlockhash: string
  instructions: Instruction[]
  logMessages: string[]
  accountKeys: string[]
  preBalances: number[]
  postBalances: number[]
  preTokenBalances: any[] // Simplified, can be more detailed
  postTokenBalances: any[] // Simplified, can be more detailed
}
