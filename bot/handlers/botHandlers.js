const { sendUserData } = require('../services/apiService');

const handleStartCommand = async (bot, msg) => {
  const chatId = msg.chat.id;
  const telegramId = Number(msg.from.id);
  const firstName = msg.from.first_name;
  const lastName = msg.from.last_name || '';
  const username = msg.from.username || '';

  const userData = {
    telegramId,
    firstName,
    lastName,
    username,
  };

  try {
    const response = await sendUserData(userData);
    if (response.success) {
      bot.sendMessage(chatId, 'Welcome to DGTL P2E game! Your account has been synced.', {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Play now!', web_app: { url: process.env.WEB_APP_URL } }]
          ]
        }
      });
    } else {
      bot.sendMessage(chatId, 'Failed to sync account. Please try again later.');
    }
  } catch (error) {
    bot.sendMessage(chatId, 'An error occurred. Please try again later.');
  }
};

module.exports = {
  handleStartCommand,
};
