const express = require('express');
const router = express.Router();
const Level = require('../models/Level');
const { LEVELS } = require('../constants/levels');

// Получить все уровни
router.get('/', async (req, res) => {
  try {
    let levelsInDB = await Level.find().sort({ order: 1 });
    console.log('Levels found in DB at start of GET /api/levels:', JSON.stringify(levelsInDB.map(l => ({name: l.name, order: l.order, badgesCount: l.badges.length, bg: l.backgroundUrl})), null, 2));

    if (levelsInDB.length === 0) {
      console.log('Database is empty. Initializing levels from constants...');
      // Clear the cache for the constants file to ensure it's re-read
      delete require.cache[require.resolve('../constants/levels')];
      const levelConstants = require('../constants/levels');
      console.log('Raw data loaded from ../constants/levels.js:', JSON.stringify(levelConstants, null, 2));

      const initialLevels = levelConstants.map(levelConstant => {
        const badges = levelConstant.minerals && Array.isArray(levelConstant.minerals)
          ? levelConstant.minerals.slice(0, 4).map(mineral => mineral.symbol || mineral)
          : [];

        return {
          name: levelConstant.name,
          order: levelConstant.order,
          availability: levelConstant.order === 1, // Initial availability for the first level
          requiredScore: levelConstant.requiredScore,
          requiredLevel: levelConstant.order - 1,
          backgroundUrl: levelConstant.backgroundUrl,
          minerals: levelConstant.minerals ? levelConstant.minerals.map(m => m.symbol || m) : [],
          badges: badges,
          duration: levelConstant.duration,
          colorScheme: levelConstant.colorScheme,
          // video specific fields if you plan to store them in DB
          // backgroundVideo: levelConstant.backgroundVideo, 
        };
      });
      console.log('Processed data to be inserted into DB:', JSON.stringify(initialLevels.map(l => ({name: l.name, order: l.order, badgesCount: l.badges.length, bg: l.backgroundUrl})), null, 2));
      
      await Level.insertMany(initialLevels);
      console.log(`${initialLevels.length} levels initialized into the database.`);
      levelsInDB = await Level.find().sort({ order: 1 }); // Re-fetch after insertion
    }

    // Apply global availability override (unlock all levels as per previous requirement)
    const finalLevelsToSend = levelsInDB.map(level => ({
      ...level._doc, // Use ._doc to get plain JavaScript object
      availability: true, // Unlock all levels
    }));

    res.json(finalLevelsToSend);
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