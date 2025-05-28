import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../lib/mongodb'; // Assuming you have the connection file in lib folder
import UserModel from '../../models/User'; // Assuming your User model is in the models folder

type ResponseData = {
  message: string;
  user?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  // Connect to the database
  await connectToDatabase();

  // Extract data from request body
  const { telegramId, firstName, lastName, username, coins, tickets, boosts } = req.body;

  try {
    // Create a new User instance using the UserModel
    const newUser = new UserModel({
      telegramId,
      firstName,
      lastName,
      username,
      coins,
      tickets,
      boosts,
    });

    // Save the new user in the database
    const savedUser = await newUser.save();
    res.status(201).json({ message: 'User added successfully', user: savedUser });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Error adding user' });
  }
}
