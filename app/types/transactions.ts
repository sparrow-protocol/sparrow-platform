import type { InferSelectModel, InferInsertModel } from "drizzle-orm"
import type { transactions } from "@/db/schema"

export type SelectTransaction = InferSelectModel<typeof transactions>
export type InsertTransaction = InferInsertModel<typeof transactions>
