export type WalletBalance = {
  mint: {
    address: string
    name: string
    symbol: string
    logoURI?: string
    decimals: number
  }
  balance: number
  value: number // USD value
}

export type WalletTransaction = {
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
  from: string
  to: string
  fee: number
  status: "success" | "failed" | "pending"
}
