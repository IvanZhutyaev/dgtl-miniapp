import mongoose from 'mongoose';

// Расширяем mongoose.Document для IUser, чтобы включить _id, и т.д.
export interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId; // Mongoose добавляет это автоматически, но оно всегда есть у документа
  telegramId: number;
  firstName: string;
  lastName?: string;
  username?: string;
  coins: number;
  boosts: Map<string, number>; // Представляем Mongoose Map как TypeScript Map
  collectedMinerals: Map<string, number>; // Представляем Mongoose Map как TypeScript Map
  lastGamePlayed?: Date | null;
  createdAt?: Date; // Добавляется через timestamps: true
  updatedAt?: Date; // Добавляется через timestamps: true
} 