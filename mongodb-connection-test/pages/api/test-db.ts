import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../lib/mongodb';
import BoostCardModel from "@/models/Boosts";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }
  
  try {
    await connectToDatabase();
    res.status(200).json({ message: 'Successfully connected to the database' });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ message: 'Database connection failed' });
  }

  const boostCard = await BoostCardModel.findOne({ id: "boost1" }).select("price").lean();
  if (boostCard) {
    res.status(200).json({ message: boostCard.price.toString() });
  }

}
