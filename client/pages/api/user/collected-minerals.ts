import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession, Session } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]'; // Adjusted path
import UserModel from '../../../models/User'; // Adjusted path
import { connectToDatabase } from '../../../lib/mongodb';
import { IUser } from '@/types/interfaces'; // Assuming LeanUser or IUser is appropriate here

interface CollectedMineralsResponse {
  minerals?: string[];
  message?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<CollectedMineralsResponse>) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const session: Session | null = await getServerSession(req, res, authOptions);
    if (!session?.user?.telegramId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const telegramIdFromSession = session.user.telegramId;
    const telegramIdNum = parseInt(telegramIdFromSession, 10);

    if (isNaN(telegramIdNum)) {
      return res.status(400).json({ message: 'Invalid user identifier' });
    }

    await connectToDatabase();
    
    // Fetch the full Mongoose document without .lean()
    const userDoc = await UserModel.findOne({ telegramId: telegramIdNum })
      .select('collectedMinerals');

    if (!userDoc) {
      return res.status(404).json({ message: 'User not found' });
    }

    let collectedSymbols: string[] = [];
    // userDoc.collectedMinerals should be a Mongoose Map
    if (userDoc.collectedMinerals && userDoc.collectedMinerals instanceof Map) {
      console.log('[API /user/collected-minerals] userDoc.collectedMinerals is a Map, converting...');
      userDoc.collectedMinerals.forEach((count, symbol) => {
        if (count > 0) {
          collectedSymbols.push(symbol);
        }
      });
    } else if (userDoc.collectedMinerals && typeof userDoc.collectedMinerals === 'object'){
      // Fallback if for some reason it's already an object (e.g. due to other parts of schema definition or middleware)
      console.log('[API /user/collected-minerals] userDoc.collectedMinerals is an object, processing as Record.');
      const mineralsRecord = userDoc.collectedMinerals as Record<string, number>; 
      collectedSymbols = Object.keys(mineralsRecord).filter(symbol => mineralsRecord[symbol] > 0);
    } else {
      console.warn(`[API /user/collected-minerals] userDoc.collectedMinerals is of unexpected type or null: ${typeof userDoc.collectedMinerals}`);
    }
    
    console.log('[API /user/collected-minerals] Returning symbols:', collectedSymbols);
    return res.status(200).json({ minerals: collectedSymbols });

  } catch (error) {
    console.error('Error fetching collected minerals:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return res.status(500).json({ message: `Internal server error: ${errorMessage}` });
  }
} 