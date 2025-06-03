import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from './[...nextauth]';
import { connectToDatabase } from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { initData } = req.body;
    console.log('Received initData:', initData);

    if (!initData) {
      return res.status(400).json({ error: 'Missing Telegram init data' });
    }

    try {
      // Get the credentials provider
      const credentialsProvider = authOptions.providers[0];
      if (!credentialsProvider || credentialsProvider.type !== 'credentials') {
        console.error('Provider configuration error');
        return res.status(500).json({ error: 'Invalid provider configuration' });
      }

      // Call the authorize function with proper credentials
      const user = await credentialsProvider.authorize(
        { initData },
        { ...req, body: { initData } }
      );

      console.log('Authorization result:', user);
      
      if (!user) {
        return res.status(401).json({ error: 'Authentication failed - No user returned' });
      }

      return res.status(200).json({ success: true, user });
    } catch (error: any) {
      console.error('Detailed authentication error:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      return res.status(401).json({ error: error.message || 'Authentication failed' });
    }
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 