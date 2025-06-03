import { getServerSession } from 'next-auth';
import UserModel from '../../../models/User';
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    console.log('Session:', session);

    // Check if the session exists (i.e., user is authenticated)
    if (!session || !session.user || !session.user.telegramId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Connect to database
    await connectToDatabase();

    // Find user by telegramId stored in the session
    const userData = await UserModel.findOne({ telegramId: session.user.telegramId }).lean();
    console.log('User data:', userData);

    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }
   
    return res.status(200).json(userData);
  } catch (error) {
    console.error('Error in /api/user/data:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' });
  }
}
