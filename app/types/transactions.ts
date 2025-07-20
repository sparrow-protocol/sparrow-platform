export type Transaction = {
  signature: string
  type: string
  timestamp: Date
  amount: number
  token: {
    address: string
    name: string
    symbol: string
    logoURI?: string
    decimals: number
  }
  from?: string
  to?: string
  fee?: number
  status: "success" | "failed" | "pending"
}
