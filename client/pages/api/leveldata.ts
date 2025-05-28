import { NextApiRequest, NextApiResponse } from 'next';
import Level from '../../models/Level';
import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Ensure that Mongoose is connected by calling the DB connection function.
    await connectToDatabase();

    const levels = await Level.find({}).sort({ order: 1 }).lean();
    return res.status(200).json(levels);
  } catch (error) {
    console.error('Error fetching levels:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
