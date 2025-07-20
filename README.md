# Sparrow Web App

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

Sparrow is a comprehensive Solana DeFi web application built with Next.js, Tailwind CSS, and shadcn/ui. It provides a dashboard to view wallet balances and recent transactions, a token swap interface powered by Jupiter Aggregator, a Solana Pay integration for sending and receiving payments, and a token faucet for development purposes.

## Features

- **Dashboard**: View real-time token balances, USD values, and recent transactions.
- **Transaction History**: Filter and paginate through transaction history with search functionality.
- **Portfolio Chart**: Visualize historical portfolio value (mock data).
- **Token Swap**: Seamlessly swap tokens using Jupiter Aggregator.
- **Solana Pay**: Send and receive payments via Solana Pay QR codes.
- **Token Faucet**: Get test tokens for development on devnet.
- **User Authentication**: Secure user authentication powered by Privy.
- **AI Assistant**: Interact with an AI assistant for DeFi-related queries.
- **Responsive Design**: Optimized for various screen sizes.
- **Dark Mode**: Toggle between light and dark themes.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: Neon (PostgreSQL) with Drizzle ORM
- **Authentication**: Privy
- **Solana Integration**: `@solana/web3.js`, `@solana/pay`, `@solana/spl-token`
- **DeFi APIs**: Jupiter Aggregator, Helius (for RPC and enhanced APIs)
- **AI**: Vercel AI SDK
- **State Management**: Jotai
- **Charting**: Recharts
- **Forms**: React Hook Form, Zod

## Getting Started

First, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

### 1. Clone the repository

\`\`\`bash
git clone https://github.com/your-username/sparrow-web-app.git
cd sparrow-web-app
\`\`\`

### 2. Install dependencies

\`\`\`bash
pnpm install
# or
npm install
# or
yarn install
\`\`\`

### 3. Set up Environment Variables

Create a `.env.local` file in the root of your project and add the following environment variables:

\`\`\`
# Neon Database
DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require"

# Helius RPC (for Solana interactions)
HELIUS_RPC_URL="https://rpc.helius.xyz/?api-key=YOUR_HELIUS_API_KEY"
NEXT_PUBLIC_HELIUS_RPC_URL="https://rpc.helius.xyz/?api-key=YOUR_HELIUS_API_KEY"

# Privy Authentication
NEXT_PUBLIC_PRIVY_APP_ID="YOUR_PRIVY_APP_ID"
PRIVY_APP_SECRET="YOUR_PRIVY_APP_SECRET"

# Solana Pay Recipient Address (for receiving payments)
SOLANA_PAY_RECIPIENT_ADDRESS="YOUR_SOLANA_WALLET_ADDRESS"

# Faucet Private Key (for the token faucet, use a devnet wallet private key)
FAUCET_PRIVATE_KEY="YOUR_FAUCET_WALLET_PRIVATE_KEY_BASE58"

# Vercel AI SDK (for AI Assistant)
OPENAI_API_KEY="YOUR_OPENAI_API_KEY" # Or other AI provider API key
\`\`\`

**Note on `FAUCET_PRIVATE_KEY`**: This should be the base58 encoded private key of a Solana wallet that will be used to fund the faucet. **Do not use a mainnet wallet for this.** Create a new devnet wallet for this purpose.

### 4. Database Setup (Neon + Drizzle)

This project uses Neon for PostgreSQL and Drizzle ORM.

**a. Push your schema to Neon:**

\`\`\`bash
pnpm db:push
\`\`\`

**b. (Optional) Open Drizzle Studio:**

\`\`\`bash
pnpm db:studio
\`\`\`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License.
