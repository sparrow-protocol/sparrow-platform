import { PublicKey } from "@solana/web3.js"
import type { TokenBalance, PortfolioHistoryData } from "@/app/types/wallet"
import type { TransactionDetails } from "@/app/types/transactions"
import { formatTimestamp } from "@/app/lib/format/date"

// Mock Wallet Address
export const MOCK_WALLET_ADDRESS = new PublicKey("YOUR_MOCK_WALLET_ADDRESS_HERE") // Replace with a real address for testing

// Mock Token Balances
export const MOCK_TOKEN_BALANCES: TokenBalance[] = [
  {
    mintAddress: new PublicKey("So11111111111111111111111111111111111111112"), // SOL
    balance: 5.23,
    usdValue: 5.23 * 150, // Assuming $150/SOL
    tokenName: "Solana",
    tokenSymbol: "SOL",
    icon: "/placeholder.svg",
    decimals: 9,
  },
  {
    mintAddress: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapTVGSSmpPackCwEKnM"), // USDC
    balance: 1200.5,
    usdValue: 1200.5 * 1, // Assuming $1/USDC
    tokenName: "USD Coin",
    tokenSymbol: "USDC",
    icon: "/placeholder.svg",
    decimals: 6,
  },
  {
    mintAddress: new PublicKey("Es9vMFrzaCERmJfrF4H2cpmu518SMoWRcHyWJ4CvgMEX"), // USDT
    balance: 800.75,
    usdValue: 800.75 * 1, // Assuming $1/USDT
    tokenName: "Tether USD",
    tokenSymbol: "USDT",
    icon: "/placeholder.svg",
    decimals: 6,
  },
  {
    mintAddress: new PublicKey("7dHbQaqt9YhYg2UnzFq8vXg7s7x7x7x7x7x7x7x7x7x"), // Example Token A
    balance: 150.0,
    usdValue: 150.0 * 0.5, // Assuming $0.5/Token A
    tokenName: "Example Token A",
    tokenSymbol: "EXA",
    icon: "/placeholder.svg",
    decimals: 9,
  },
  {
    mintAddress: new PublicKey("8dHbQaqt9YhYg2UnzFq8vXg7s7x7x7x7x7x7x7x7x7x"), // Example Token B
    balance: 25.0,
    usdValue: 25.0 * 10, // Assuming $10/Token B
    tokenName: "Example Token B",
    tokenSymbol: "EXB",
    icon: "/placeholder.svg",
    decimals: 9,
  },
]

// Mock Portfolio History Data
export const MOCK_PORTFOLIO_HISTORY: PortfolioHistoryData[] = [
  { date: "2023-01-01", value: 1000 },
  { date: "2023-01-02", value: 1050 },
  { date: "2023-01-03", value: 1020 },
  { date: "2023-01-04", value: 1100 },
  { date: "2023-01-05", value: 1080 },
  { date: "2023-01-06", value: 1150 },
  { date: "2023-01-07", value: 1120 },
  { date: "2023-01-08", value: 1200 },
  { date: "2023-01-09", value: 1180 },
  { date: "2023-01-10", value: 1250 },
]

// Mock Transaction Details
const now = Date.now()
export const MOCK_TRANSACTIONS: TransactionDetails[] = [
  {
    signature: "5jK1L...example1",
    timestamp: formatTimestamp(now - 3600 * 1000), // 1 hour ago
    type: "transfer",
    status: "success",
    fee: 0.000005,
    block: 123456789,
    slot: 123456789,
    recentBlockhash: "someblockhash1",
    instructions: [{ program: "spl-token", type: "transfer", info: { amount: "100", mint: "USDC" } }],
    logMessages: ["Program log: Transfer successful"],
    accountKeys: ["sender", "receiver", "mint"],
    preBalances: [1000000000, 500000000],
    postBalances: [999999995, 500000005],
    preTokenBalances: [],
    postTokenBalances: [],
  },
  {
    signature: "6kL2M...example2",
    timestamp: formatTimestamp(now - 7200 * 1000), // 2 hours ago
    type: "program_interaction",
    status: "failed",
    fee: 0.000005,
    block: 123456788,
    slot: 123456788,
    recentBlockhash: "someblockhash2",
    instructions: [{ program: "my-program", type: "initialize", info: {} }],
    logMessages: ["Program log: Initialization failed"],
    accountKeys: ["program", "signer"],
    preBalances: [1000000000],
    postBalances: [999999995],
    preTokenBalances: [],
    postTokenBalances: [],
  },
  {
    signature: "7mL3N...example3",
    timestamp: formatTimestamp(now - 10800 * 1000), // 3 hours ago
    type: "transfer",
    status: "success",
    fee: 0.000005,
    block: 123456787,
    slot: 123456787,
    recentBlockhash: "someblockhash3",
    instructions: [{ program: "spl-token", type: "transfer", info: { amount: "5", mint: "SOL" } }],
    logMessages: ["Program log: SOL transfer"],
    accountKeys: ["sender", "receiver", "mint"],
    preBalances: [1000000000, 200000000],
    postBalances: [999999995, 200000005],
    preTokenBalances: [],
    postTokenBalances: [],
  },
  {
    signature: "8nO4P...example4",
    timestamp: formatTimestamp(now - 14400 * 1000), // 4 hours ago
    type: "program_interaction",
    status: "success",
    fee: 0.000005,
    block: 123456786,
    slot: 123456786,
    recentBlockhash: "someblockhash4",
    instructions: [{ program: "another-program", type: "execute", info: {} }],
    logMessages: ["Program log: Execution complete"],
    accountKeys: ["program", "data"],
    preBalances: [1000000000],
    postBalances: [999999995],
    preTokenBalances: [],
    postTokenBalances: [],
  },
  {
    signature: "9pQ5R...example5",
    timestamp: formatTimestamp(now - 18000 * 1000), // 5 hours ago
    type: "transfer",
    status: "success",
    fee: 0.000005,
    block: 123456785,
    slot: 123456785,
    recentBlockhash: "someblockhash5",
    instructions: [{ program: "spl-token", type: "transfer", info: { amount: "20", mint: "USDT" } }],
    logMessages: ["Program log: USDT sent"],
    accountKeys: ["sender", "receiver", "mint"],
    preBalances: [1000000000, 300000000],
    postBalances: [999999995, 300000005],
    preTokenBalances: [],
    postTokenBalances: [],
  },
  {
    signature: "aQ6S...example6",
    timestamp: formatTimestamp(now - 21600 * 1000), // 6 hours ago
    type: "program_interaction",
    status: "success",
    fee: 0.000005,
    block: 123456784,
    slot: 123456784,
    recentBlockhash: "someblockhash6",
    instructions: [{ program: "defi-protocol", type: "swap", info: { tokenA: "SOL", tokenB: "USDC" } }],
    logMessages: ["Program log: Swap executed"],
    accountKeys: ["protocol", "user", "tokenA", "tokenB"],
    preBalances: [1000000000],
    postBalances: [999999995],
    preTokenBalances: [],
    postTokenBalances: [],
  },
  {
    signature: "bR7T...example7",
    timestamp: formatTimestamp(now - 25200 * 1000), // 7 hours ago
    type: "transfer",
    status: "failed",
    fee: 0.000005,
    block: 123456783,
    slot: 123456783,
    recentBlockhash: "someblockhash7",
    instructions: [{ program: "spl-token", type: "transfer", info: { amount: "50", mint: "EXA" } }],
    logMessages: ["Program log: Insufficient funds"],
    accountKeys: ["sender", "receiver", "mint"],
    preBalances: [1000000000, 100000000],
    postBalances: [999999995, 100000000],
    preTokenBalances: [],
    postTokenBalances: [],
  },
  {
    signature: "cS8U...example8",
    timestamp: formatTimestamp(now - 28800 * 1000), // 8 hours ago
    type: "program_interaction",
    status: "success",
    fee: 0.000005,
    block: 123456782,
    slot: 123456782,
    recentBlockhash: "someblockhash8",
    instructions: [{ program: "nft-mint", type: "mint", info: { nftName: "MyCoolNFT" } }],
    logMessages: ["Program log: NFT minted"],
    accountKeys: ["minter", "nft"],
    preBalances: [1000000000],
    postBalances: [999999995],
    preTokenBalances: [],
    postTokenBalances: [],
  },
  {
    signature: "dT9V...example9",
    timestamp: formatTimestamp(now - 32400 * 1000), // 9 hours ago
    type: "transfer",
    status: "success",
    fee: 0.000005,
    block: 123456781,
    slot: 123456781,
    recentBlockhash: "someblockhash9",
    instructions: [{ program: "spl-token", type: "transfer", info: { amount: "1", mint: "EXB" } }],
    logMessages: ["Program log: EXB received"],
    accountKeys: ["sender", "receiver", "mint"],
    preBalances: [1000000000, 50000000],
    postBalances: [999999995, 50000005],
    preTokenBalances: [],
    postTokenBalances: [],
  },
  {
    signature: "eU0W...example10",
    timestamp: formatTimestamp(now - 36000 * 1000), // 10 hours ago
    type: "program_interaction",
    status: "success",
    fee: 0.000005,
    block: 123456780,
    slot: 123456780,
    recentBlockhash: "someblockhash10",
    instructions: [{ program: "staking-pool", type: "stake", info: { amount: "10", token: "SOL" } }],
    logMessages: ["Program log: Staked SOL"],
    accountKeys: ["staker", "pool"],
    preBalances: [1000000000],
    postBalances: [999999995],
    preTokenBalances: [],
    postTokenBalances: [],
  },
]
