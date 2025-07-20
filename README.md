# Sparrow Web App

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

A modular web application and dashboard for Solana DeFi.

## Features

- **Next.js App Router**: Built with the latest Next.js features for modern web development.
- **Shadcn/ui**: Beautifully designed and accessible UI components.
- **Tailwind CSS**: Utility-first CSS framework for rapid styling.
- **Neon Database**: Scalable PostgreSQL database for robust data storage.
- **Drizzle ORM**: TypeScript ORM for type-safe database interactions.
- **Privy Authentication**: Secure and seamless user authentication.
- **Solana Wallet Integration**: Connect and interact with Solana wallets.
- **Jupiter Aggregator Integration**: Perform token swaps using Jupiter's liquidity.
- **Solana Pay Integration**: Send and receive payments on the Solana blockchain.
- **AI SDK Integration**: Integrate AI models for various functionalities.
- **Modular Structure**: Organized codebase for easy maintenance and scalability.
- **Responsive Design**: Optimized for various screen sizes and devices.

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
git clone https://github.com/vercel-labs/sparrow-web-app.git
cd sparrow-web-app
\`\`\`

### 2. Install dependencies

\`\`\`bash
pnpm install
\`\`\`

### 3. Set up environment variables

Create a `.env.local` file in the root directory and add the following environment variables:

\`\`\`
# Neon Database
DATABASE_URL="YOUR_NEON_DATABASE_URL"

# Privy Authentication
NEXT_PUBLIC_PRIVY_APP_ID="YOUR_PRIVY_APP_ID"
PRIVY_APP_SECRET="YOUR_PRIVY_APP_SECRET"

# Solana RPC (Helius recommended for enhanced APIs)
NEXT_PUBLIC_HELIUS_RPC_URL="YOUR_HELIUS_RPC_URL"
NEXT_PUBLIC_SOLANA_RPC_URL="YOUR_SOLANA_RPC_URL" # Fallback if Helius is not used
NEXT_PUBLIC_SOLANA_NETWORK="devnet" # or "mainnet-beta", "testnet"

# Solana Pay
SOLANA_PAY_RECIPIENT_ADDRESS="YOUR_SOLANA_PAY_RECIPIENT_ADDRESS" # Your wallet address to receive payments

# AI SDK (Optional, for AI features)
GROQ_API_KEY="YOUR_GROQ_API_KEY"
XAI_API_KEY="YOUR_XAI_API_KEY" # For Grok models

# Faucet (Optional, for local development/testing)
FAUCET_PRIVATE_KEY="YOUR_FAUCET_PRIVATE_KEY" # Private key of a wallet with SOL for faucet
\`\`\`

### 4. Run database migrations

\`\`\`bash
pnpm drizzle-kit push:pg
\`\`\`

### 5. Run the development server

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

\`\`\`
.
├── app/                  # Next.js App Router pages, layouts, and API routes
│   ├── api/              # API routes (e.g., /api/faucet)
│   ├── dashboard/        # Dashboard pages
│   ├── faucet/           # Faucet page
│   ├── login/            # Login page
│   ├── pay/              # Solana Pay page
│   ├── swap/             # Token swap page
│   ├── transactions/     # Transaction details page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   ├── not-found.tsx     # Custom 404 page
│   ├── page.tsx          # Home page
│   └── types/            # TypeScript types for app-specific data
├── ai/                   # AI SDK related files (chat, providers)
├── components/           # Reusable React components
│   ├── ui/               # Shadcn/ui components
│   ├── dashboard/        # Dashboard specific components
│   ├── faucet/           # Faucet specific components
│   ├── solana-pay/       # Solana Pay specific components
│   └── swap/             # Swap specific components
├── config/               # Site configuration
├── db/                   # Database schema and queries (Drizzle ORM)
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and helpers
│   ├── auth/             # Authentication utilities
│   ├── format/           # Formatting utilities
│   ├── jupiter/          # Jupiter API integration
│   ├── solana/           # Solana blockchain interaction utilities
│   └── utils.ts          # General utilities
├── public/               # Static assets
├── scripts/              # Database migration scripts
├── server/               # Server-side actions
├── styles/               # Additional global styles
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies and scripts
\`\`\`

## Learn More

To learn more about the technologies used in this project, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Shadcn/ui Documentation](https://ui.shadcn.com/docs) - learn about Shadcn/ui components.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - learn about Tailwind CSS.
- [Neon Documentation](https://neon.tech/docs) - learn about Neon database.
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview/postgresql) - learn about Drizzle ORM.
- [Privy Documentation](https://docs.privy.io/) - learn about Privy authentication.
- [Solana Web3.js Documentation](https://solana-web3.github.io/solana-web3.js/) - learn about Solana blockchain interaction.
- [Jupiter API Documentation](https://station.jup.ag/docs/apis/overview) - learn about Jupiter Aggregator API.
- [Solana Pay Documentation](https://solanapay.com/docs) - learn about Solana Pay.
- [AI SDK Documentation](https://sdk.vercel.ai/docs) - learn about AI SDK.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-button) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
