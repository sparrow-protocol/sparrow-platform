import { type Connection, PublicKey } from "@solana/web3.js"
import { getAssociatedTokenAddressSync, getAccount } from "@solana/spl-token"
import { MOCK_TOKEN_BALANCES } from "@/app/lib/mock-data"
import type { TokenBalance } from "@/app/types/wallet"
import { getTokenPrice } from "@/app/lib/defi-api"

export async function getWalletBalances(connection: Connection, walletAddress: PublicKey): Promise<TokenBalance[]> {
  // In a real application, you would fetch actual balances from the Solana network
  // For now, we'll return mock data and simulate fetching prices.
  console.log(`Fetching balances for ${walletAddress.toBase58()}`)

  const balances: TokenBalance[] = []

  // Fetch SOL balance
  try {
    const solBalanceLamports = await connection.getBalance(walletAddress)
    const solBalance = solBalanceLamports / 1_000_000_000 // Convert lamports to SOL
    const solPrice = await getTokenPrice("So11111111111111111111111111111111111111112") // SOL mint address
    balances.push({
      mintAddress: new PublicKey("So11111111111111111111111111111111111111112"),
      balance: solBalance,
      usdValue: solPrice ? solBalance * solPrice : 0,
      tokenName: "Solana",
      tokenSymbol: "SOL",
      icon: "/placeholder.svg",
      decimals: 9,
    })
  } catch (error) {
    console.error("Error fetching SOL balance:", error)
  }

  // Fetch SPL token balances (using mock data for other tokens)
  for (const mockToken of MOCK_TOKEN_BALANCES) {
    if (mockToken.symbol === "SOL") continue // Already handled SOL

    try {
      const tokenAccountPubkey = getAssociatedTokenAddressSync(mockToken.mintAddress, walletAddress)
      const tokenAccount = await getAccount(connection, tokenAccountPubkey)
      const tokenBalance = Number(tokenAccount.amount) / Math.pow(10, mockToken.decimals)
      const tokenPrice = await getTokenPrice(mockToken.mintAddress.toBase58())
      balances.push({
        ...mockToken,
        balance: tokenBalance,
        usdValue: tokenPrice ? tokenBalance * tokenPrice : 0,
      })
    } catch (error) {
      // If account not found, balance is 0, or other error, skip this token
      console.warn(`Could not fetch balance for ${mockToken.symbol}:`, error)
      balances.push({
        ...mockToken,
        balance: 0,
        usdValue: 0,
      })
    }
  }

  return balances
}
