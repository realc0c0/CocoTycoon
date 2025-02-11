import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScoreSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  app.get("/api/scores", async (req, res) => {
    const scores = await storage.getTopScores(10);
    res.json(scores);
  });

  app.post("/api/scores", async (req, res) => {
    const result = insertScoreSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: "Invalid score data" });
      return;
    }
    
    const score = await storage.addScore(result.data);
    res.json(score);
  });

  const httpServer = createServer(app);
  return httpServer;
}
