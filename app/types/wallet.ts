export interface WalletBalance {
  mintAddress: string
  tokenSymbol: string
  tokenName: string
  balance: number // In token units
  usdValue: number | null
  iconUrl?: string
}
