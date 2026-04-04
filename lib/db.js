import mongoose from 'mongoose';

const MONGODB_URI = process.env.DB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the DB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function connect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      //console.log('Connected to MongoDB via Cached Promise');
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    if (process.env.NODE_ENV === 'development') {
      console.error('MongoDB connection failed:', e);
    }
    throw e;
  }

  return cached.conn;
}
