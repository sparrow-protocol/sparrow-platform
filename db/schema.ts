import { pgTable, text, timestamp, uuid, uniqueIndex } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey().notNull(),
    privyDID: text("privy_did").notNull().unique(),
    walletAddress: text("wallet_address").notNull().unique(),
    email: text("email"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (users) => {
    return {
      privyDIDIndex: uniqueIndex("privy_did_index").on(users.privyDID),
      walletAddressIndex: uniqueIndex("wallet_address_index").on(users.walletAddress),
    }
  },
)

export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(transactions),
  chatMessages: many(chatMessages),
}))

export const transactions = pgTable(
  "transactions",
  {
    signature: text("signature").primaryKey().notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    timestamp: timestamp("timestamp").defaultNow().notNull(),
    type: text("type").notNull(), // e.g., 'transfer', 'swap', 'mint'
    status: text("status").notNull(), // 'success', 'failed'
    fee: text("fee").notNull(), // Store as text to avoid precision issues
    block: text("block").notNull(),
    fromAddress: text("from_address"),
    toAddress: text("to_address"),
    amount: text("amount"),
    tokenMint: text("token_mint"),
  },
  (transactions) => {
    return {
      signatureIndex: uniqueIndex("signature_index").on(transactions.signature),
      userIdIndex: uniqueIndex("user_id_index").on(transactions.userId),
    }
  },
)

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}))

export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
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
