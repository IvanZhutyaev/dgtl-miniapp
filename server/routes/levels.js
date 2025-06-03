const express = require('express');
const router = express.Router();
const Level = require('../models/Level');
const { LEVELS } = require('../constants/levels');

// Получить все уровни
router.get('/', async (req, res) => {
  try {
    let levels = await Level.find().sort({ order: 1 });
    
    // Если уровней нет в БД, инициализируем их
    if (levels.length === 0) {
      const initialLevels = LEVELS.map((level, index) => ({
        name: level.name,
        order: level.id,
        badges: index === 0 ? ["Br", "Au", "C", "Fe"] : [], // Добавляем элементы для первого уровня
        backgroundUrl: level.backgroundUrl,
        availability: index === 0 ? true : false, // Первый уровень доступен по умолчанию
        requiredScore: index * 1000,
        requiredLevel: index
      }));

      await Level.insertMany(initialLevels);
      levels = await Level.find().sort({ order: 1 });
    }

    res.json(levels);
  } catch (error) {
    console.error('Error fetching levels:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Обновить данные уровня
router.post('/update/:levelId', async (req, res) => {
  try {
    const level = await Level.findOneAndUpdate(
      { order: parseInt(req.params.levelId) },
      { $set: req.body },
      { new: true }
    );
    
    if (!level) {
      return res.status(404).json({ message: 'Level not found' });
    }
    
    res.json(level);
  } catch (error) {
    console.error('Error updating level:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Обновить доступность уровня
router.post('/unlock/:levelId', async (req, res) => {
  try {
    const level = await Level.findOneAndUpdate(
      { order: parseInt(req.params.levelId) },
      { availability: true },
      { new: true }
    );
    
    if (!level) {
      return res.status(404).json({ message: 'Level not found' });
    }
    
    res.json(level);
  } catch (error) {
    console.error('Error updating level:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Проверить доступность следующего уровня
router.post('/check-next/:currentLevel', async (req, res) => {
  try {
    const { score } = req.body;
    const nextLevelOrder = parseInt(req.params.currentLevel) + 1;
    
    const nextLevel = await Level.findOne({ order: nextLevelOrder });
    if (!nextLevel) {
      return res.status(404).json({ message: 'Next level not found' });
    }
    
    if (score >= nextLevel.requiredScore) {
      nextLevel.availability = true;
      await nextLevel.save();
      return res.json({ unlocked: true, level: nextLevel });
    }
    
    res.json({ unlocked: false, requiredScore: nextLevel.requiredScore });
  } catch (error) {
    console.error('Error checking next level:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router; 