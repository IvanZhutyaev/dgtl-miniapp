const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: { type: Number, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, default: '' },
  username: { type: String, default: '' },
  coins: { type: Number, default: 0 },
  boosts: { type: Map, of: Number, default: {} },
  lastGamePlayed: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Обновляем updatedAt перед каждым сохранением
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('User', userSchema); 