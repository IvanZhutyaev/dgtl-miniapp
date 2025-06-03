const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  order: { type: Number, required: true, unique: true },
  badges: { type: [String], default: [] },
  backgroundUrl: { type: String, default: "" },
  availability: { type: Boolean, default: false },
  requiredScore: { type: Number, default: 0 },
  requiredLevel: { type: Number, default: 0 }
}, {
  collection: 'leveldata'
});

module.exports = mongoose.model('Level', levelSchema); 