require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { handleStartCommand } = require('./handlers/botHandlers');

// Проверяем наличие необходимых переменных окружения
const requiredEnvVars = ['TELEGRAM_BOT_TOKEN', 'WEB_APP_URL', 'SERVER_URL'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL;
const SERVER_URL = process.env.SERVER_URL;

console.log('Initializing bot with configuration:', {
  TELEGRAM_BOT_TOKEN: TELEGRAM_BOT_TOKEN ? '**present**' : '**missing**',
  WEB_APP_URL,
  SERVER_URL
});

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { 
  polling: true,
  webHook: false
});

// Обработка ошибок polling
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
  // Пытаемся перезапустить polling при ошибке
  if (bot.isPolling()) {
    bot.stopPolling();
  }
  setTimeout(() => {
    bot.startPolling();
  }, 5000);
});

// Обработка ошибок webhook
bot.on('webhook_error', (error) => {
  console.error('Webhook error:', error);
});

// Обработка команды /start
bot.onText(/\/start/, async (msg) => {
  console.log('Received /start command from user:', {
    userId: msg.from.id,
    username: msg.from.username,
    firstName: msg.from.first_name,
    lastName: msg.from.last_name
  });
  
  try {
    await handleStartCommand(bot, msg);
  } catch (error) {
    console.error('Error handling /start command:', error);
    bot.sendMessage(msg.chat.id, 'Произошла ошибка. Пожалуйста, попробуйте позже.');
  }
});

console.log('Bot is starting...');

// Проверяем, что бот успешно запустился
bot.getMe().then((botInfo) => {
  console.log('Bot successfully started:', botInfo);
}).catch((error) => {
  console.error('Failed to start bot:', error);
  process.exit(1);
});
