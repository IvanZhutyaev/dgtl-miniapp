const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: { type: Number, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, default: '' },
  username: { type: String, default: '' },
  coins: { type: Number, default: 0 },
  boosts: { type: Map, of: Number, default: () => new Map() },
  collectedMinerals: { type: Map, of: Number, default: () => new Map() },
  lastGamePlayed: { type: Date, default: null },
}, {
  timestamps: true // Автоматически добавляет и управляет createdAt и updatedAt
});

module.exports = mongoose.model('User', userSchema);