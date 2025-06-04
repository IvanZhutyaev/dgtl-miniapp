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
  console.log("[API /user/data] Received request for /api/user/data"); // Новый лог
  const session: Session | null = await getServerSession(req, res, authOptions);

  // Подробное логирование объекта сессии
  console.log("[API /user/data] Session object:", JSON.stringify(session, null, 2));

  if (!session?.user?.telegramId) {
    console.error("[API /user/data] Unauthorized: No session or telegramId in session.user");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const telegramIdFromSession = session.user.telegramId;
  console.log(`[API /user/data] Extracted telegramId from session: ${telegramIdFromSession}, type: ${typeof telegramIdFromSession}`); // Новый лог

  const telegramIdNum = parseInt(telegramIdFromSession, 10);
  console.log(`[API /user/data] Parsed telegramId to number: ${telegramIdNum}, type: ${typeof telegramIdNum}`); // Новый лог

  if (isNaN(telegramIdNum)) {
    console.error(`[API /user/data] Invalid telegramId: ${telegramIdFromSession} resulted in NaN after parseInt.`);
    return res.status(400).json({ message: "Invalid user identifier" });
  }

  try {
    // console.log("[API /user/data] Connecting to DB...");
    await connectToDatabase();
    // console.log("[API /user/data] DB Connected.");
    
    console.log(`[API /user/data] Mongoose connection state: ${mongoose.connection.readyState}`); // Лог состояния соединения
    console.log(`[API /user/data] ПЕРЕД ЗАПРОСОМ (упрощенным): Ищем telegramId: ${telegramIdNum} (тип: ${typeof telegramIdNum}) с использованием UserModel`);

    let rawUserData = null;
    try {
      rawUserData = await UserModel.findOne({ telegramId: telegramIdNum });
    } catch (dbQueryError) {
      console.error(`[API /user/data] ОШИБКА непосредственно при UserModel.findOne:`, dbQueryError);
      // Используем type assertion для dbQueryError.message
      return res.status(500).json({ message: `Database query failed: ${(dbQueryError as Error).message}` });
    }
    
    console.log(`[API /user/data] ПОСЛЕ ЗАПРОСА (упрощенного): Результат UserModel.findOne (сырой): ${JSON.stringify(rawUserData, null, 2)}`);

    // ВЕСЬ ОСТАЛЬНОЙ КОД ОБРАБОТКИ И ВОЗВРАТА ДАННЫХ ПОКА ЗАКОММЕНТИРОВАН ДЛЯ ТЕСТА
    /*
    console.log('[API /user/data] Raw user data from DB (with explicit select):', JSON.stringify(userData, null, 2));

    if (!userData) {
      // Возвращаем 404, если пользователь не найден, с правильным форматом сообщения
      console.log(`[API /user/data] User not found in DB with telegramId: ${telegramIdNum}`); 
      return res.status(404).json({ message: 'User not found' });
    }

    let processedCollectedMinerals: Record<string, number> = userData.collectedMinerals || {};

    if (userData.collectedMinerals && userData.collectedMinerals instanceof Map) {
        console.warn('[API /user/data] userData.collectedMinerals was unexpectedly a Map after .lean(), converting.');
        processedCollectedMinerals = Object.fromEntries(userData.collectedMinerals as any);
    } else if (userData.collectedMinerals && typeof userData.collectedMinerals === 'object') {
        processedCollectedMinerals = userData.collectedMinerals;
    }

    const responseData = {
      ...userData, 
      collectedMinerals: processedCollectedMinerals,
    };
    console.log('[API /user/data] Processed response data to be sent:', JSON.stringify(responseData, null, 2));

    return res.status(200).json(responseData);
    */

    // НОВЫЙ ВРЕМЕННЫЙ ОТВЕТ для теста:
    if (!rawUserData) {
      console.log(`[API /user/data] Упрощенный запрос НЕ НАШЕЛ пользователя с telegramId: ${telegramIdNum}`);
      return res.status(404).json({ message: 'User not found by simplified query (see server logs).' });
    } else {
      console.log(`[API /user/data] Упрощенный запрос НАШЕЛ пользователя. ID: ${rawUserData._id}. Данные в логах.`);
      // Возвращаем простой ответ, соответствующий типу { message: string }
      return res.status(200).json({ 
        message: `User found by simplified query. User _id: ${rawUserData._id}. Check server logs for full data.`
      });
    }

  } catch (error) {
    console.error('Error in /api/user/data (внешний try-catch):', error);
    const errorMessage = error instanceof Error ? `Internal Server Error: ${error.message}` : 'Internal Server Error';
    return res.status(500).json({
        message: errorMessage
    });
  }
}