require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { handleStartCommand } = require('./handlers/botHandlers');
const { token } = require('./config/botConfig');

console.log('Bot token:', token);
console.log('Environment variables loaded:', {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  WEB_APP_URL: process.env.WEB_APP_URL,
  SERVER_URL: process.env.SERVER_URL
});

const bot = new TelegramBot(token, { polling: true });

bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

bot.onText(/\/start/, (msg) => {
  console.log('Received /start command from user:', msg.from.id);
  handleStartCommand(bot, msg);
});

console.log('Bot is running...');
