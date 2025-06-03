const express = require('express');
const router = express.Router();
const CollectedMineral = require('../models/CollectedMineral');
const User = require('../models/User');

// Добавить собранный минерал
router.post('/collect', async (req, res) => {
  try {
    const { userId, atomicNumber, levelId } = req.body;

    // Проверяем существование пользователя
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Создаем или обновляем запись о собранном минерале
    const mineral = await CollectedMineral.findOneAndUpdate(
      { userId, atomicNumber, levelId },
      { $setOnInsert: { collectedAt: new Date() } },
      { upsert: true, new: true }
    );

    res.json({ success: true, mineral });
  } catch (error) {
    console.error('Error collecting mineral:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Получить все собранные минералы пользователя
router.get('/user/:userId', async (req, res) => {
  try {
    const minerals = await CollectedMineral.find({ userId: req.params.userId })
      .sort({ collectedAt: -1 });
    
    res.json({ success: true, minerals });
  } catch (error) {
    console.error('Error getting collected minerals:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Получить все уровни, на которых собран конкретный минерал
router.get('/element/:atomicNumber/user/:userId', async (req, res) => {
  try {
    const minerals = await CollectedMineral.find({
      userId: req.params.userId,
      atomicNumber: req.params.atomicNumber
    }).sort({ levelId: 1 });
    
    res.json({ success: true, minerals });
  } catch (error) {
    console.error('Error getting mineral levels:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router; 