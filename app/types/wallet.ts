export interface WalletBalance {
  mintAddress: string
  tokenSymbol: string
  balance: number
  usdValue: number | null
  iconUrl?: string
}
