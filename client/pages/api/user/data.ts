import { getSession } from 'next-auth/react';
import UserModel from '../../../models/User';
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Request Headers:', req.headers);
  const session = await getSession({ req });
  console.log('Request session:', session);

  // Check if the session exists (i.e., user is authenticated)
  if (!session || !session.user || !session.user.telegramId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Find user by telegramId stored in the session
    await connectToDatabase()
    const userData = await UserModel.findOne({ telegramId: session.user.telegramId }).lean();
    console.log("user was found: ", userData)
    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }
   
    return res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
