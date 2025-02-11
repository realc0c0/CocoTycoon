import { pgTable, text, serial, integer, bigint } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const scores = pgTable("scores", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  score: bigint("score", { mode: "number" }).notNull(),
  achievements: integer("achievements").notNull()
});

export const insertScoreSchema = createInsertSchema(scores).pick({
  username: true,
  score: true,
  achievements: true
});

export type InsertScore = z.infer<typeof insertScoreSchema>;
export type Score = typeof scores.$inferSelect;
