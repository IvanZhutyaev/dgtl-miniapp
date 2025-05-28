import { getServerSession } from "next-auth/next";
import UserModel from "../../models/User";
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import { authOptions } from "../api/auth/[...nextauth]";

interface BoostUsage {
  [boostId: string]: number; // e.g., { "boost1": 2, "boost2": 1 }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.telegramId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { amount, boostsUsed }: { amount: number; boostsUsed: BoostUsage } = req.body;

  // Validate input
  if (
    typeof amount !== "number" ||
    amount < 0 ||
    typeof boostsUsed !== "object" ||
    !boostsUsed ||
    !Object.values(boostsUsed).every((v) => typeof v === "number" && v >= 0)
  ) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    await connectToDatabase();

    const sessionDb = await UserModel.startSession();
    sessionDb.startTransaction();

    try {
      const user = await UserModel.findOne({ telegramId: session.user.telegramId }).session(sessionDb);

      if (!user) {
        await sessionDb.abortTransaction();
        return res.status(404).json({ error: "User not found" });
      }

      // Deduct boosts
      for (const boostId in boostsUsed) {
        if (!user.boosts[boostId] || user.boosts[boostId] < boostsUsed[boostId]) {
          await sessionDb.abortTransaction();
          return res.status(400).json({ error: `Insufficient boosts for ${boostId}` });
        }
        user.boosts[boostId] -= boostsUsed[boostId];
      }

      // Increment coins
      user.coins = (user.coins || 0) + amount;

      // Save the user document
      await user.save({ session: sessionDb });

      await sessionDb.commitTransaction();

      return res.status(200).json({
        message: "Game data updated successfully",
        boosts: user.boosts,
        coins: user.coins,
      });
    } catch (error) {
      await sessionDb.abortTransaction();
      console.error("Transaction error:", error);
      return res.status(500).json({ error: "Failed to update game data" });
    } finally {
      sessionDb.endSession();
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
