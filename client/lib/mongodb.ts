import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// Global cache to avoid multiple connections in serverless environments
declare global {
  var mongooseCache: MongooseCache;
}

global.mongooseCache = global.mongooseCache || { conn: null, promise: null };

export async function connectToDatabase(): Promise<mongoose.Connection> {
  if (global.mongooseCache.conn) {
    console.log('Using cached database connection');
    return global.mongooseCache.conn;
  }

  if (!global.mongooseCache.promise) {
    console.log('Creating new database connection promise');
    global.mongooseCache.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      console.log('Connected to MongoDB');
      return mongoose.connection;
    });
  }

  global.mongooseCache.conn = await global.mongooseCache.promise;
  return global.mongooseCache.conn;
}

