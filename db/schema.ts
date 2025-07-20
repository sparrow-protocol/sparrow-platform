import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  privyId: text("privy_id").unique().notNull(),
  walletAddress: text("wallet_address").unique().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLogin: timestamp("last_login").defaultNow().notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(transactions),
  chatMessages: many(chatMessages),
}))

export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  signature: text("signature").unique().notNull(),
  type: text("type").notNull(), // e.g., 'swap', 'solana_pay', 'transfer'
  amount: text("amount").notNull(), // Store as string to avoid precision issues
  tokenMint: text("token_mint"), // Mint address of the token involved
  status: text("status").notNull(), // e.g., 'pending', 'confirmed', 'failed'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  fromTokenMint: text("from_token_mint"),
  toTokenMint: text("to_token_mint"),
  fromAmount: text("from_amount"),
  toAmount: text("to_amount"),
  priceImpact: text("price_impact"),
})

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}))

export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
}))
