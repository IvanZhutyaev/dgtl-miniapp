const mongoose = require('mongoose');

const collectedMineralSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  atomicNumber: {
    type: Number,
    required: true
  },
  levelId: {
    type: Number,
    required: true
  },
  collectedAt: {
    type: Date,
    default: Date.now
  }
});

// Составной индекс для быстрого поиска
collectedMineralSchema.index({ userId: 1, atomicNumber: 1, levelId: 1 });

module.exports = mongoose.model('CollectedMineral', collectedMineralSchema); 