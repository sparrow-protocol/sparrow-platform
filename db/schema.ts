import { pgTable, text, timestamp, serial, uniqueIndex } from "drizzle-orm/pg-core"

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    privyId: text("privy_id").notNull().unique(),
    email: text("email"),
    walletAddress: text("wallet_address").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (users) => {
    return {
      privyIdIndex: uniqueIndex("privy_id_index").on(users.privyId),
      walletAddressIndex: uniqueIndex("wallet_address_index").on(users.walletAddress),
    }
  },
)

export const transactions = pgTable(
  "transactions",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(), // Foreign key to users table
    signature: text("signature").notNull().unique(),
    type: text("type").notNull(),
    amount: text("amount").notNull(),
    tokenSymbol: text("token_symbol").notNull(),
    timestamp: timestamp("timestamp").defaultNow().notNull(),
    status: text("status").notNull(),
    fee: text("fee"),
  },
  (transactions) => {
    return {
      signatureIndex: uniqueIndex("signature_index").on(transactions.signature),
    }
  },
)
