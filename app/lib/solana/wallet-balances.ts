import { Connection, PublicKey } from "@solana/web3.js"
import { getTokenPrice } from "@/app/lib/defi-api"
import { getJupiterTokenByMint } from "@/app/lib/jupiter/jupiter-token"
import type { WalletBalance } from "@/app/types/wallet"

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com"
const connection = new Connection(SOLANA_RPC_URL, "confirmed")

export async function getWalletBalances(walletAddress: string): Promise<WalletBalance[]> {
  if (!walletAddress) {
    return []
  }

  const publicKey = new PublicKey(walletAddress)
  const tokenAccounts = await connection.getTokenAccountsByOwner(publicKey, {
    programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5mW"), // SPL Token Program ID
  })

  const balances: WalletBalance[] = []

  // Add SOL balance
  const solBalanceLamports = await connection.getBalance(publicKey)
  const solBalance = solBalanceLamports / 1_000_000_000 // Convert lamports to SOL
  const solPrice = await getTokenPrice("So11111111111111111111111111111111111111112") // SOL Mint Address
  balances.push({
    mintAddress: "So11111111111111111111111111111111111111112",
    tokenSymbol: "SOL",
    balance: solBalance,
    usdValue: solBalance * (solPrice || 0),
    iconUrl:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  })

  for (const account of tokenAccounts.value) {
    const accountInfo = await connection.getParsedAccountInfo(account.pubkey)
    if (accountInfo.value && accountInfo.value.data) {
      const parsedInfo = (accountInfo.value.data as any).parsed.info
      const mintAddress = parsedInfo.mint
      const amount = parsedInfo.tokenAmount.uiAmount

      if (amount > 0) {
        const jupiterToken = await getJupiterTokenByMint(mintAddress)
        const tokenPrice = await getTokenPrice(mintAddress)

        balances.push({
          mintAddress: mintAddress,
          tokenSymbol: jupiterToken?.symbol || "UNKNOWN",
          balance: amount,
          usdValue: amount * (tokenPrice || 0),
          iconUrl: jupiterToken?.logoURI || undefined,
        })
      }
    }
  }

  return balances.sort((a, b) => (b.usdValue || 0) - (a.usdValue || 0))
}
