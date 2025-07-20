import { Connection, PublicKey } from "@solana/web3.js"
import { Jupiter, type RouteInfo } from "@jup-ag/sdk"
import { ENV as JupiterENV } from "@jup-ag/common"
import { type TokenInfo, TokenListProvider } from "@solana/spl-token-registry"

export const getJupiterTokens = async (): Promise<TokenInfo[]> => {
  try {
    const tokens = await new TokenListProvider().resolve().then((tokens) =>
      tokens
        .filterByClusterSlug("mainnet-beta")
        .getList()
        .filter((token) => token.chainId === 101),
    )
    return tokens
  } catch (error) {
    console.error("Failed to fetch Jupiter tokens:", error)
    return []
  }
}

export const getJupiterQuote = async (
  inputMint: PublicKey,
  outputMint: PublicKey,
  amount: number,
  slippageBps = 50, // 0.5% slippage
): Promise<RouteInfo | null> => {
  try {
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL!)
    const jupiter = await Jupiter.load({
      connection,
      cluster: JupiterENV.Devnet, // Use Devnet for testing
      user: new PublicKey("11111111111111111111111111111111"), // Placeholder, replace with actual user wallet
    })

    const routes = await jupiter.computeRoutes({
      inputMint,
      outputMint,
      amount,
      slippageBps,
      forceFetch: true,
    })

    if (routes?.routesInfos && routes.routesInfos.length > 0) {
      return routes.routesInfos[0] // Return the best route
    }
    return null
  } catch (error) {
    console.error("Failed to get Jupiter quote:", error)
    return null
  }
}

export const executeJupiterSwap = async (
  route: RouteInfo,
  wallet: any, // Replace with actual wallet type
): Promise<string | null> => {
  try {
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL!)
    const jupiter = await Jupiter.load({
      connection,
      cluster: JupiterENV.Devnet, // Use Devnet for testing
      user: wallet.publicKey,
    })

    const { swapTx } = await jupiter.exchange({
      route,
      wallet,
    })

    const txid = await connection.sendRawTransaction(swapTx.serialize())
    await connection.confirmTransaction(txid)
    return txid
  } catch (error) {
    console.error("Failed to execute Jupiter swap:", error)
    return null
  }
}
