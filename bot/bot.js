require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { handleStartCommand } = require('./handlers/botHandlers');
const { token } = require('./config/botConfig');

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => handleStartCommand(bot, msg));

console.log('Bot is running...');
