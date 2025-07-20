export type JupiterToken = {
  address: string
  chainId: number
  decimals: number
  name: string
  symbol: string
  logoURI?: string
  tags: string[]
}

export type QuoteResponse = {
  inputMint: string
  inAmount: string
  outputMint: string
  outAmount: string
  outAmountWithSlippage: string
  otherAmountThreshold: string
  swapMode: string
  slippageBps: number
  platformFee: {
    amount: string
    mint: string
    percent: number
  }
  priceImpactPct: string
  routePlan: Array<any> // This can be more detailed if needed
  context: {
    rpcRetries: number
    simUnitLimit: number
    usageLogs: any
  }
  timeTaken: number
  totalFees: string
}

export type SwapInstructionsResponse = {
  tokenLedgerInstruction: any
  computeBudgetInstructions: Array<any>
  setupInstructions: Array<any>
  swapInstruction: {
    programId: string
    accounts: Array<any>
    data: string
  }
  cleanupInstruction: any
  addressLookupTableAccounts: Array<any>
  autoSlippage: number
  swapMode: string
  prioritizationFeeLamports: number
  serializedTransaction: string
}
