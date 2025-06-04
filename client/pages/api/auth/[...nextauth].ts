import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '../../../lib/mongodb';
import User from '../../../models/User';
import crypto from 'crypto';
import type { NextAuthOptions } from 'next-auth';

interface TelegramUser {
  id: string;
  telegramId: string;
  first_name: string;
  last_name?: string;
  username?: string;
}

export const authOptions: NextAuthOptions  = {
  providers: [
    CredentialsProvider({
      name: 'Telegram',
      credentials: {
        initData: { label: 'Telegram Init Data', type: 'text' },
      },
      async authorize(credentials) {
        try {
          const initData = credentials?.initData;
          console.log(initData);
          if (!initData) {
            throw new Error('Missing Telegram Init Data');
          }

          const telegramUser = verifyTelegramData(initData);

          // Connect to the database
          await connectToDatabase();
          const user = await findOrCreateUser(telegramUser);

          return {
            id: user._id.toString(),
            telegramId: user.telegramId,
            firstName: user.firstName,
            lastName: user.lastName || '',
            username: user.username || '',
          };
        } catch (error) {
          console.error('Authorization failed:', error);
          throw new Error('Authentication failed');
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      // Now `token` has the extended type
      if (token?.sub) {
        session.user.id = token.sub; // или user.id, если адаптер вернул пользователя
      }
      if (token?.telegramId) { // Если вы добавляете telegramId в токен
        session.user.telegramId = token.telegramId as string;
      }
      // ... добавление других полей в сессию
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.telegramId = user.telegramId;
        token.firstName = user.firstName;
        token.lastName = user.lastName || '';
        token.username = user.username || '';
      }
      return token;
    },
  },
  pages: {
    signIn: '/authpage',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);

// Helper function to verify Telegram data
function verifyTelegramData(initData: string): TelegramUser {
  console.log('[Auth verifyTelegramData] ENTERING function');
  console.log('[Auth verifyTelegramData] Raw initData string received (JSON.stringify):', JSON.stringify(initData));
  // console.log('[Auth verifyTelegramData] Raw initData (Buffer to hex):', Buffer.from(initData).toString('hex')); // Раскомментируйте для глубокой отладки

  const rawBotToken = process.env.TELEGRAM_BOT_TOKEN;
  const BOT_TOKEN = typeof rawBotToken === 'string' ? rawBotToken.trim() : rawBotToken;

  console.log('[Auth verifyTelegramData] ИСПОЛЬЗУЕМЫЙ BOT_TOKEN (УДАЛИТЕ ЭТОТ ЛОГ ПОСЛЕ ОТЛАДКИ!): ' + "'" + BOT_TOKEN + "'");
  console.log('[Auth verifyTelegramData] Attempting to verify initData. TELEGRAM_BOT_TOKEN presence:', BOT_TOKEN ? 'Present' : 'Not found');
  if (!BOT_TOKEN) {
    console.error('[Auth verifyTelegramData] Critical: Telegram Bot Token is not defined in the environment variables for this API route.');
    throw new Error('Telegram Bot Token is not defined');
  }

  const initDataParams = new URLSearchParams(initData);

  const hash = initDataParams.get('hash');
  if (!hash) {
    console.error('[Auth verifyTelegramData] Critical: Hash parameter is missing in initData.');
    throw new Error('Hash parameter is missing in initData');
  }
  initDataParams.delete('hash');

  const dataCheckStringArray: string[] = [];
  Array.from(initDataParams.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([key, value]) => {
      // Убираем специальную обработку для 'user', используем значение как есть от URLSearchParams
      dataCheckStringArray.push(`${key}=${value}`);
    });
  const dataCheckString = dataCheckStringArray.join('\n');
  console.log('[Auth verifyTelegramData] Constructed dataCheckString for hashing (user param NOT normalized):');
  console.log(dataCheckString);

  const secretKeyMaterial = 'WebAppData';

  const secretKey = crypto
    .createHmac('sha256', secretKeyMaterial)
    .update(BOT_TOKEN)
    .digest('hex');

  // @ts-ignore Оставляем на всякий случай, если ошибка будет на computedHash
  const computedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
  
  console.log(`[Auth verifyTelegramData] Hash comparison: computed: ${computedHash}, received: ${hash}`);

  if (computedHash !== hash) {
    console.error('[Auth verifyTelegramData] Hash mismatch! This is the cause of \'Invalid Telegram init data\'. Ensure BOT_TOKEN is correct and dataCheckString matches Telegram\'s expectation.');
    throw new Error('Invalid Telegram init data');
  }

  const userRaw = initDataParams.get('user');
  if (!userRaw) {
    throw new Error('User data is missing in initData');
  }

  const telegramUser: TelegramUser = JSON.parse(userRaw);
  return telegramUser;
}

// Helper function for database operations
async function findOrCreateUser(telegramUser: TelegramUser) {
  // telegramUser.id из initData приходит как строка, даже если это число, т.к. парсится из URLSearchParams
  const telegramIdString = telegramUser.id;
  console.log(`[Auth findOrCreateUser] Received telegramUser.id (should be string): ${telegramIdString}, type: ${typeof telegramIdString}`);
  
  if (!telegramIdString || typeof telegramIdString !== 'string') { // Усиленная проверка
      console.error('[Auth findOrCreateUser] telegramUser.id is missing, empty, or not a string.');
      throw new Error('Telegram user ID is missing or invalid');
  }
  
  const telegramIdNum = parseInt(telegramIdString, 10);

  if (isNaN(telegramIdNum)) {
      console.error(`[Auth findOrCreateUser] Failed to parse telegramIdString to number. Original: '${telegramIdString}'`);
      throw new Error(`Invalid Telegram user ID format: ${telegramIdString}`);
  }
  console.log(`[Auth findOrCreateUser] Parsed telegramId to number: ${telegramIdNum}`);

  let userDoc = null;
  try {
    userDoc = await User.findOne({ telegramId: telegramIdNum }); // Поиск по ЧИСЛОВОМУ telegramId
    console.log(`[Auth findOrCreateUser] User found by findOne({ telegramId: ${telegramIdNum} }):`, userDoc ? userDoc._id.toString() : 'null');
  } catch (e) {
    console.error(`[Auth findOrCreateUser] Error during User.findOne for telegramId ${telegramIdNum}:`, e);
    throw e; // Перебрасываем ошибку, чтобы authorize ее поймал
  }
  

  if (!userDoc) {
    console.log(`[Auth findOrCreateUser] User with numeric telegramId ${telegramIdNum} not found. Creating new user.`);
    try {
      userDoc = new User({
        telegramId: telegramIdNum, // Сохраняем как ЧИСЛО
        firstName: telegramUser.first_name || '',
        lastName: telegramUser.last_name || '',
        username: telegramUser.username || '',
        // Убедитесь, что схема User.js корректно инициализирует collectedMinerals и другие поля по умолчанию
      });
      await userDoc.save();
      console.log(`[Auth findOrCreateUser] New user created with _id: ${userDoc._id.toString()} for numeric telegramId ${telegramIdNum}`);
    } catch (e) {
      console.error(`[Auth findOrCreateUser] Error during new User() or user.save() for telegramId ${telegramIdNum}:`, e);
      throw e; // Перебрасываем ошибку
    }
  } else {
    console.log(`[Auth findOrCreateUser] Existing user found with _id: ${userDoc._id.toString()} for numeric telegramId ${telegramIdNum}`);
  }
  return userDoc;
}

