const { sendUserData } = require('../services/apiService');
const { WEB_APP_URL } = require('../config/botConfig');

const handleStartCommand = async (bot, msg) => {
  const chatId = msg.chat.id;
  const telegramId = Number(msg.from.id);
  const firstName = msg.from.first_name;
  const lastName = msg.from.last_name || '';
  const username = msg.from.username || '';

  console.log('Processing start command for user:', {
    chatId,
    telegramId,
    firstName,
    lastName,
    username
  });

  try {
    // Отправляем начальное сообщение
    await bot.sendMessage(chatId, 'Подождите, идет синхронизация данных...');

    console.log('Attempting to send user data to server...');
    const userData = {
      telegramId,
      firstName,
      lastName,
      username,
    };

    const response = await sendUserData(userData);
    console.log('Server response:', response);
    
    if (response.success) {
      console.log('Successfully synced user data');
      
      const keyboard = {
        inline_keyboard: [
          [{ text: 'Играть!', web_app: { url: WEB_APP_URL } }]
        ]
      };

      console.log('Using WEB_APP_URL:', WEB_APP_URL);

      await bot.sendMessage(
        chatId, 
        `Добро пожаловать в DGTL P2E игру, ${firstName}! 🎮\n\nВаш аккаунт успешно синхронизирован.`,
        { reply_markup: keyboard }
      );
    } else {
      console.error('Failed to sync account:', response);
      throw new Error('Failed to sync account');
    }
  } catch (error) {
    console.error('Error in handleStartCommand:', error);
    
    // Отправляем сообщение об ошибке пользователю
    await bot.sendMessage(
      chatId, 
      'Извините, произошла ошибка при синхронизации данных. Пожалуйста, попробуйте позже или обратитесь в поддержку.'
    );
    
    // Пробрасываем ошибку дальше для логирования
    throw error;
  }
};

module.exports = {
  handleStartCommand,
};
