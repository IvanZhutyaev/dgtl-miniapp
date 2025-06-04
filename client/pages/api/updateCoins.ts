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
  console.log("[API updateCoins] Received request"); // Оставляем
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.telegramId) {
    console.error("[API updateCoins] Unauthorized: No session or telegramId"); // Оставляем
    return res.status(401).json({ error: "Unauthorized" });
  }
  // Удаляем: console.log("[API updateCoins] Session telegramId:", session.user.telegramId);

  // Преобразуем telegramId из сессии в число
  const telegramIdNum = parseInt(session.user.telegramId, 10);
  if (isNaN(telegramIdNum)) {
    console.error("[API updateCoins] Invalid telegramId in session:", session.user.telegramId);
    return res.status(400).json({ error: "Invalid user identifier" });
  }

  if (req.method !== "POST") {
    console.error("[API updateCoins] Method Not Allowed:", req.method); // Оставляем (изменено с warn на error ранее)
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Удаляем: console.log("[API updateCoins] Request body:", JSON.stringify(req.body, null, 2));

  const { 
    score, 
    boostsUsed, 
    collectedMineralsInGame 
  } = req.body;

  // Удаляем: console.log("[API updateCoins] Parsed from body - score:", score, "boostsUsed:", boostsUsed, "collectedMineralsInGame:", collectedMineralsInGame);

  if (typeof score !== "number" || score < 0) {
    console.error("[API updateCoins] Invalid input: score is missing or invalid.", { score }); // Оставляем
    return res.status(400).json({ error: "Invalid input: score must be a positive number." });
  }

  if (typeof boostsUsed !== "object" || !boostsUsed || !Object.values(boostsUsed).every((v) => typeof v === "number" && v >= 0)) {
    console.error("[API updateCoins] Invalid input: boostsUsed is not an object or contains invalid values.", { boostsUsed }); // Оставляем: Ошибка валидации
    return res.status(400).json({ error: "Invalid input: boostsUsed must be a non-negative object." });
  }

  if (collectedMineralsInGame && (typeof collectedMineralsInGame !== "object" || !Object.values(collectedMineralsInGame).every(v => typeof v === "number" && v >= 0))) {
    console.error("[API updateCoins] Invalid input: collectedMineralsInGame is not an object or contains invalid values.", { collectedMineralsInGame }); // Оставляем: Ошибка валидации
    return res.status(400).json({ error: "Invalid input: collectedMineralsInGame must be a non-negative object." });
  }

  // Удаляем: console.log("[API updateCoins] Input validation passed.");

  try {
    // Удаляем: console.log("[API updateCoins] Connecting to DB...");
    await connectToDatabase();
    // Удаляем: console.log("[API updateCoins] DB Connected. Finding user by telegramId:", session.user.telegramId);

    const user = await UserModel.findOne({ telegramId: telegramIdNum }).exec() as IUser | null;

    if (!user) {
      console.error("[API updateCoins] User not found with telegramId:", telegramIdNum); // Оставляем
      return res.status(404).json({ error: "User not found" });
    }

    // Удаляем: console.log("[API updateCoins] User found. Current coins:", user.coins);
    // Удаляем: console.log("[API updateCoins] Current user.collectedMinerals (before update):", user.collectedMinerals);

    user.boosts = user.boosts || new Map<string, number>();
    user.collectedMinerals = user.collectedMinerals || new Map<string, number>();
    // Удаляем: console.log("[API updateCoins] User boosts and minerals maps ensured."); // Удаляем: Детали пользователя

    // Deduct boosts
    if (boostsUsed && Object.keys(boostsUsed).length > 0) {
      // Удаляем: console.log("[API updateCoins] Processing boostsUsed:", boostsUsed); // Удаляем: Детали обработки
      if (!(user.boosts instanceof Map)) {
        console.warn("[API updateCoins] user.boosts is not a Map. Initializing as new Map."); // Оставляем
        user.boosts = new Map();
      }
      for (const boostId in boostsUsed) {
        if (Object.prototype.hasOwnProperty.call(boostsUsed, boostId)) {
          const quantityUsed = boostsUsed[boostId];
          if (typeof quantityUsed === 'number' && quantityUsed > 0) {
            const currentBoostCount = user.boosts.get(boostId) || 0;
            // Удаляем: console.log(`[API updateCoins] Boost ${boostId}: current count ${currentBoostCount}, used ${quantityUsed}`); // Удаляем: Детали буста
            if (currentBoostCount >= quantityUsed) {
              user.boosts.set(boostId, currentBoostCount - quantityUsed);
              // Удаляем: console.log(`[API updateCoins] Boost ${boostId} new count: ${user.boosts.get(boostId)}`); // Удаляем: Детали буста
            } else {
              console.warn(`[API updateCoins] Attempted to use ${quantityUsed} of boost ${boostId}, but user only has ${currentBoostCount}. Setting to 0.`); // Оставляем
              user.boosts.set(boostId, 0);
            }
          }
        }
      }
      // Удаляем: console.log("[API updateCoins] User boosts updated:", user.boosts); // Удаляем: Детали пользователя
    } else {
      // Удаляем: console.log("[API updateCoins] No boosts were used or boostsUsed is empty."); // Удаляем: Детали обработки
    }

    // Increment coins
    const oldCoins = user.coins || 0;
    user.coins = oldCoins + score;
    // Удаляем: console.log("[API updateCoins] User coins updated to:", user.coins); // Удаляем: Детали обновления

    // Update collected minerals
    if (collectedMineralsInGame && typeof collectedMineralsInGame === 'object' && Object.keys(collectedMineralsInGame).length > 0) {
      // Удаляем: console.log("[API updateCoins] Processing collectedMineralsInGame:", collectedMineralsInGame); // Удаляем: Детали обработки
      if (!(user.collectedMinerals instanceof Map)) {
        console.warn("[API updateCoins] user.collectedMinerals is not a Map. Initializing as new Map. Current type:", typeof user.collectedMinerals, "Value:", user.collectedMinerals); // Оставляем
        user.collectedMinerals = new Map<string, number>();
      }
      for (const symbol in collectedMineralsInGame) {
        if (Object.prototype.hasOwnProperty.call(collectedMineralsInGame, symbol)) {
          const count = collectedMineralsInGame[symbol];
          if (typeof count === 'number' && count > 0) {
            const currentCount = user.collectedMinerals.get(symbol) || 0;
            user.collectedMinerals.set(symbol, currentCount + count);
            // Удаляем: console.log(`[API updateCoins] Updated mineral ${symbol}: old count ${currentCount}, added ${count}, new count ${user.collectedMinerals.get(symbol)}`); // Удаляем: Детали обновления минерала
          } else {
            // Можно оставить: console.warn(`[API updateCoins] Invalid count for mineral ${symbol}: ${count}. Skipping.`); // Можно оставить, если часто такое бывает
          }
        }
      }
      // Удаляем: console.log("[API updateCoins] User collectedMinerals updated:", user.collectedMinerals); // Удаляем: Детали пользователя
    } else {
      // Удаляем: console.log("[API updateCoins] No new minerals collected or collectedMineralsInGame is empty."); // Удаляем: Детали обработки
    }

    console.log("[API updateCoins] BEFORE SAVE - user.collectedMinerals:", JSON.stringify(Object.fromEntries(user.collectedMinerals || new Map())));
    await user.save();
    const savedUser = await UserModel.findById(user._id).select('collectedMinerals coins boosts').lean(); // также получаем coins и boosts для полноты ответа
    console.log("[API updateCoins] AFTER SAVE - user.collectedMinerals FROM DB:", JSON.stringify(savedUser?.collectedMinerals));
    console.log("[API updateCoins] User data saved successfully."); // Изменено: убран ID из лога

    // Используем данные из savedUser для формирования ответа, чтобы быть уверенными, что отдаем актуальное состояние из БД
    const boostsToReturn = savedUser?.boosts && typeof savedUser.boosts === 'object' 
        ? savedUser.boosts 
        : {};

    let responseCollectedMinerals = {};
    if (savedUser?.collectedMinerals && typeof savedUser.collectedMinerals === 'object') {
        responseCollectedMinerals = savedUser.collectedMinerals;
    } else if (savedUser?.collectedMinerals) { // Если это не объект, но существует (маловероятно после lean() для Map)
        console.warn(
            `[API updateCoins] user.collectedMinerals was found post-save but is not a Map. Type: ${typeof savedUser.collectedMinerals}, Value:`,
            savedUser.collectedMinerals
        );
    }
    // Удаляем: console.log("[API updateCoins] Prepared response data. Coins:", user.coins, "Boosts:", boostsToReturn, "Minerals:", responseCollectedMinerals); // Удаляем: Детали ответа

    return res.status(200).json({
      message: "Game data updated successfully",
      boosts: boostsToReturn,
      coins: savedUser?.coins ?? user.coins, // Приоритет savedUser, если есть, иначе старое значение user.coins
      collectedMinerals: responseCollectedMinerals 
    });
  } catch (error) {
    console.error("Error during database operations:", error);
    return res.status(500).json({ error: "Failed to update game data" });
  }
}
