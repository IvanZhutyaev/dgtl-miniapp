const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Синхронизация данных пользователя из Telegram
router.post('/sync', async (req, res) => {
  try {
    const { telegramId, firstName, lastName, username } = req.body;

    // Ищем пользователя по telegramId
    let user = await User.findOne({ telegramId });

    if (user) {
      // Обновляем существующего пользователя
      user.firstName = firstName;
      user.lastName = lastName;
      user.username = username;
      await user.save();
    } else {
      // Создаем нового пользователя
      user = new User({
        telegramId,
        firstName,
        lastName,
        username,
        coins: 0,
        boosts: {},
        lastGamePlayed: null
      });
      await user.save();
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user by Telegram ID
router.get('/:telegramId', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router; 