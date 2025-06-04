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

  const receivedHash = initDataParams.get('hash'); // Получаем hash до любых манипуляций
  if (!receivedHash) {
    console.error('[Auth verifyTelegramData] Critical: Hash parameter is missing in initData.');
    throw new Error('Hash parameter is missing in initData');
  }
  // initDataParams.delete('hash'); // Больше не используем initDataParams для сборки
  // initDataParams.delete('signature');

  // Ручное формирование dataCheckString из исходной строки initData
  const pairs = initData.split('&');
  const dataCheckStringArray: string[] = [];

  for (const pair of pairs) {
    const parts = pair.split('=');
    const key = parts[0];
    // const value = parts.slice(1).join('='); // Если значение может содержать '='

    if (key !== 'hash' && key !== 'signature') {
      // Важно: URLSearchParams автоматически декодирует значения.
      // Здесь мы используем пару как есть из строки, предполагая, что Telegram ожидает именно это.
      // Если значения были URL-кодированы, они должны оставаться такими для dataCheckString,
      // либо их нужно единообразно декодировать, если Telegram этого ожидает.
      // Большинство примеров подразумевают использование УЖЕ ДЕКОДИРОВАННЫХ значений из URLSearchParams.
      // Но для чистоты эксперимента попробуем взять декодированное значение из URLSearchParams,
      // отсортировав ключи из оригинального initData.

      // Чтобы сохранить консистентность с предыдущим подходом сортировки и получения значений,
      // лучше все же использовать URLSearchParams для получения декодированных значений,
      // но собирать dataCheckString из отсортированного списка ключей.
      // Предыдущая ошибка была не в URLSearchParams, а, возможно, в секретном ключе или порядке.

      // Возвращаемся к использованию URLSearchParams для получения пар ключ-значение,
      // так как это стандартный способ работы с query string и обеспечивает URL-декодирование.
      // Проблема была не здесь. Оставим как было, но убедимся, что hash удален ПЕРЕД сортировкой.
      // Фактически, код ниже делает то же, что и раньше, но мы перепроверяем логику.
      // Ключевое - hash и signature удаляются. Остальные сортируются и объединяются.
      // Это уже было сделано корректно.

      // Отменяем ручной парсинг, так как он усложняет и может внести новые ошибки с декодированием.
      // Проблема точно не в URLSearchParams, если он используется стандартно.
      // Вернемся к проверенному способу с URLSearchParams, но будем внимательны к деталям.
    }
  }

  // Фактически, оставляем предыдущий рабочий механизм с URLSearchParams,
  // так как он корректно обрабатывает URL-декодирование и сортировку.
  // Убедимся, что hash и signature удалены.
  const paramsForHash = new URLSearchParams(initData);
  const originalHash = paramsForHash.get('hash'); // Сохраняем оригинальный hash для сравнения

  if (!originalHash) {
      console.error('[Auth verifyTelegramData] Critical: Hash parameter is missing in initData (re-check).');
      throw new Error('Hash parameter is missing in initData (re-check)');
  }

  paramsForHash.delete('hash');
  // paramsForHash.delete('signature'); // БОЛЬШЕ НЕ УДАЛЯЕМ signature

  const sortedParamsArray: string[] = [];
  Array.from(paramsForHash.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([key, value]) => {
      sortedParamsArray.push(`${key}=${value}`);
    });
  const dataCheckString = sortedParamsArray.join('\n');

  console.log('[Auth verifyTelegramData] Constructed dataCheckString for hashing (hash excluded, SIGNATURE INCLUDED, user param NOT normalized):');
  console.log(dataCheckString);

  // Правильное вычисление secretKey согласно документации Telegram
  const secretKeyBuffer = crypto
    .createHmac('sha256', 'WebAppData') // 'WebAppData' используется как КЛЮЧ
    .update(BOT_TOKEN)                  // BOT_TOKEN используется как ДАННЫЕ
    .digest();                          // Возвращает Buffer

  const secretKeyObject = crypto.createSecretKey(secretKeyBuffer as Uint8Array); // Явно указываем тип

  // @ts-ignore больше не нужен, так как secretKeyObject это KeyObject и совместим с createHmac
  const computedHash = crypto
    .createHmac('sha256', secretKeyObject) // Используем KeyObject
    .update(dataCheckString)
    .digest('hex');
  
  console.log(`[Auth verifyTelegramData] Hash comparison: computed: ${computedHash}, received: ${originalHash}`);

  if (computedHash !== originalHash) {
    console.error('[Auth verifyTelegramData] Hash mismatch! This is the cause of \'Invalid Telegram init data\'. Ensure BOT_TOKEN is correct and dataCheckString matches Telegram\'s expectation.');
    throw new Error('Invalid Telegram init data');
  }

  const userRaw = paramsForHash.get('user'); // Используем paramsForHash, т.к. оттуда уже удален hash/signature
  if (!userRaw) {
    throw new Error('User data is missing in initData');
  }

  const parsedUser = JSON.parse(userRaw);
  const telegramUser: TelegramUser = {
    ...parsedUser,
    id: String(parsedUser.id), // Убедимся, что id это строка
    // telegramId также должен быть строкой, если он используется и приходит как число
    // telegramId: String(parsedUser.telegramId || parsedUser.id) // Пример, если telegramId может отсутствовать
  };

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

