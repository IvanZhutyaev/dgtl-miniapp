import { connectToDatabase } from '@/lib/mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { db } = await connectToDatabase();

    if (!db) {
      return res.status(500).json({ error: "Database connection failed." });
    }

    const boostCards = await db.collection("boosts-cards").find({ availability: true }).toArray();
    return res.status(200).json(boostCards);
  } catch (error) {
    console.error("Error fetching boost cards:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
