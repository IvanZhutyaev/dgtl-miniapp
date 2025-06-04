import { getServerSession } from "next-auth/next";
import UserModel from "../../models/User";
import { IUser } from "@/types/interfaces";
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import { authOptions } from "../api/auth/[...nextauth]";

interface BoostUsage {
  [boostId: string]: number; // e.g., { "boost1": 2, "boost2": 1 }
}

// Интерфейс для собранных в игре минералов
interface CollectedMineralsInGame {
  [symbol: string]: number; 
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.telegramId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { 
    amount, 
    boostsUsed, 
    collectedMineralsInGame 
  }: { 
    amount: number; 
    boostsUsed: BoostUsage; 
    collectedMineralsInGame?: CollectedMineralsInGame; // <-- Новое поле
  } = req.body;

  // Validate input
  if (
    typeof amount !== "number" ||
    amount < 0 ||
    typeof boostsUsed !== "object" ||
    !boostsUsed ||
    !Object.values(boostsUsed).every((v) => typeof v === "number" && v >= 0) ||
    // Валидация для collectedMineralsInGame (если передано)
    (collectedMineralsInGame && 
      (typeof collectedMineralsInGame !== "object" || 
       !Object.values(collectedMineralsInGame).every(v => typeof v === "number" && v >= 0)))
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    await connectToDatabase();

    try {
      // Приводим результат к IUser | null
      const user = await UserModel.findOne({ telegramId: session.user.telegramId }).exec() as IUser | null;

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Обеспечиваем наличие Map перед использованием get/set для TypeScript
      // Несмотря на default в схеме, это хорошая практика для работы с существующими данными
      user.boosts = user.boosts || new Map<string, number>();
      user.collectedMinerals = user.collectedMinerals || new Map<string, number>();

      // Deduct boosts
      for (const boostId in boostsUsed) {
        if (boostsUsed[boostId] > 0) {
          const currentBoostCount = user.boosts.get(boostId) || 0;
          if (currentBoostCount < boostsUsed[boostId]) {
            return res.status(400).json({ error: `Insufficient boosts for ${boostId}` });
          }
          user.boosts.set(boostId, currentBoostCount - boostsUsed[boostId]);
        }
      }

      // Increment coins
      user.coins = (user.coins || 0) + amount;

      // Update collected minerals
      if (collectedMineralsInGame) {
        for (const symbol in collectedMineralsInGame) {
          const countInGame = collectedMineralsInGame[symbol];
          if (countInGame > 0) {
            const currentCount = user.collectedMinerals.get(symbol) || 0;
            user.collectedMinerals.set(symbol, currentCount + countInGame);
          }
        }
      }

      await user.save();
      
      // Преобразуем Map в обычные объекты для JSON ответа
      const boostsToReturn = Object.fromEntries(user.boosts);
      const collectedMineralsToReturn = Object.fromEntries(user.collectedMinerals);

      return res.status(200).json({
        message: "Game data updated successfully",
        boosts: boostsToReturn,
        coins: user.coins,
        collectedMinerals: collectedMineralsToReturn 
      });
    } catch (error) {
      console.error("Error during database operations:", error);
      return res.status(500).json({ error: "Failed to update game data" });
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
