import { getServerSession, Session } from 'next-auth';
import UserModel from '../../../models/User'; // Предполагается, что путь корректен
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb'; // Предполагается, что путь корректен
import { authOptions } from '../auth/[...nextauth]'; // Предполагается, что путь корректен
import { IUser } from '@/types/interfaces'; // Убедитесь, что путь к IUser корректен
import { Types } from 'mongoose'; // Добавлен для использования Types.ObjectId
import mongoose from 'mongoose';

// Интерфейс для данных пользователя после .lean()
// Все поля, типы или опциональность которых могут измениться после .lean(),
// должны быть перечислены в Omit и затем явно определены в LeanUser.
interface LeanUser extends Omit<IUser,
  'telegramId' |
  'username' |
  'firstName' |
  'lastName' |
  'coins' |
  'energy' |
  'lastLogin' |
  'collectedMinerals' |
  'boosts' |
  'levelProgress' | // Если это Map или сложный тип в IUser
  'dailyRewards' |  // Если это сложный тип в IUser
  'friends' |       // Если это сложный тип в IUser
  'referrals' |     // Если это сложный тип в IUser
  'lastGamePlayed' |
  'createdAt' |
  'updatedAt' |
  '_id' |
  '__v'
> {
  _id: Types.ObjectId; // В IUser _id может быть string | Types.ObjectId
  telegramId: string; // В IUser telegramId может быть string | number, здесь ожидаем строку из сессии
  username?: string;
  firstName?: string;
  lastName?: string;
  coins?: number;
  energy?: {
    current: number;
    lastReplenished: string | Date; // Date может стать строкой ISO
  };
  lastLogin?: string | Date; // Date может стать строкой ISO
  collectedMinerals?: Record<string, number>; // Map преобразуется в Record<string, number> через .lean()
  boosts?: Record<string, number>;           // Map преобразуется в Record<string, number> через .lean()
  lastGamePlayed?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;

  // Пример для сложных полей, если они есть в IUser и преобразуются:
  // levelProgress?: Record<string, { score: number; unlocked: boolean; stars: number }>;
  // dailyRewards?: { lastClaimed?: string | Date; streak?: number; claimedToday?: boolean };
  // friends?: string[]; // Если это массив ID, тип может остаться тем же
  // referrals?: { count?: number; referredBy?: string; referredUsers?: string[] };

  // Все остальные поля из IUser, не указанные в Omit, наследуются "как есть".
  // Если они тоже преобразуются (например, другие Date или Map), их также нужно добавить в Omit и определить здесь.
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LeanUser | { message: string }>
) {
  console.log("[API /user/data] Received request for /api/user/data");
  const session: Session | null = await getServerSession(req, res, authOptions);

  console.log("[API /user/data] Session object:", JSON.stringify(session, null, 2));

  if (!session?.user?.telegramId) {
    console.error("[API /user/data] Unauthorized: No session or telegramId in session.user");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const telegramIdFromSession = session.user.telegramId;
  console.log(`[API /user/data] Extracted telegramId from session: ${telegramIdFromSession}, type: ${typeof telegramIdFromSession}`);

  const telegramIdNum = parseInt(telegramIdFromSession, 10);
  console.log(`[API /user/data] Parsed telegramId to number: ${telegramIdNum}, type: ${typeof telegramIdNum}`);

  if (isNaN(telegramIdNum)) {
    console.error(`[API /user/data] Invalid telegramId: ${telegramIdFromSession} resulted in NaN after parseInt.`);
    return res.status(400).json({ message: "Invalid user identifier" });
  }

  try {
    await connectToDatabase();
    
    console.log(`[API /user/data] Mongoose connection state: ${mongoose.connection.readyState}`);
    console.log(`[API /user/data] ПЕРЕД ЗАПРОСОМ: Ищем telegramId: ${telegramIdNum} (тип: ${typeof telegramIdNum}) с использованием UserModel.lean()`);

    // Use .lean() and type assertion for LeanUser
    const userDocument = await UserModel.findOne({ telegramId: telegramIdNum }).lean<LeanUser>();
    
    console.log(`[API /user/data] ПОСЛЕ ЗАПРОСА: Результат UserModel.findOne().lean(): ${JSON.stringify(userDocument, null, 2)}`);

    if (!userDocument) {
      console.log(`[API /user/data] User not found in DB with telegramId: ${telegramIdNum}`); 
      return res.status(404).json({ message: 'User not found' });
    }

    // Process collectedMinerals if it's a Map (lean() should handle this for simple Maps to objects)
    // However, the LeanUser type definition anticipates collectedMinerals and boosts as Record<string, number>
    // So, direct usage should be fine if the schema matches.
    // For safety, ensure that if they were complex Maps, they are correctly transformed.
    // .lean() typically converts simple string-keyed Maps to plain objects.

    // The LeanUser interface expects dates to potentially be strings if they come from JSON,
    // but .lean() from Mongoose should keep them as Date objects if not stringified yet.
    // The final res.status(200).json(userDocument) will stringify Dates to ISO strings.

    // Ensure all necessary fields (firstName, username, coins) are present in LeanUser and selected by default (no .select() used here means all fields)
    console.log(`[API /user/data] Returning userDocument: username='${userDocument.username}', firstName='${userDocument.firstName}', coins='${userDocument.coins}'`);

    return res.status(200).json(userDocument);

  } catch (error) {
    console.error('Error in /api/user/data (внешний try-catch):', error);
    const errorMessage = error instanceof Error ? `Internal Server Error: ${error.message}` : 'Internal Server Error';
    return res.status(500).json({
        message: errorMessage
    });
  }
}