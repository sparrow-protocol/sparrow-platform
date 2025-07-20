import type { InferSelectModel, InferInsertModel } from "drizzle-orm"
import type { users } from "@/db/schema"

export type SelectUser = InferSelectModel<typeof users>
export type InsertUser = InferInsertModel<typeof users>
