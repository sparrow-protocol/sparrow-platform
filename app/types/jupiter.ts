export type JupiterQuoteResponse = {
  inAmount: string
  outAmount: string
  outAmountWithSlippage: string
  priceImpactPct: number
  routePlan: any[] // Simplified, can be more detailed if needed
  swapMode: string
  slippageBps: number
  timeTaken: number
}

export type JupiterSwapInstructionsResponse = {
  swapRequest: {
    swapTransaction: string // Base64 encoded transaction
  }
}

export type JupiterToken = {
  address: string
  chainId: number
  decimals: number
  name: string
  symbol: string
  logoURI: string
  tags: string[]
}
