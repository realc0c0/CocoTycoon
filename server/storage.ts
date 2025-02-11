import { scores, type Score, type InsertScore } from "@shared/schema";
import { db } from "./db";
import { desc } from "drizzle-orm";

export interface IStorage {
  getTopScores(limit: number): Promise<Score[]>;
  addScore(score: InsertScore): Promise<Score>;
}

export class DatabaseStorage implements IStorage {
  async getTopScores(limit: number): Promise<Score[]> {
    return await db.select()
      .from(scores)
      .orderBy(desc(scores.score))
      .limit(limit);
  }

  async addScore(insertScore: InsertScore): Promise<Score> {
    const [score] = await db
      .insert(scores)
      .values(insertScore)
      .returning();
    return score;
  }
}

export const storage = new DatabaseStorage();