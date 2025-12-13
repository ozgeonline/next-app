import mongoose from 'mongoose';
let isConnected = false;

export default async function connect() {
  if (isConnected) {
    //console.log('Using existing MongoDB connection');
    return;
  }
  const MONGODB_URI = process.env.DB_URI;
  if(!MONGODB_URI) {
    throw new Error('DB_URI is not defined');
  }
  //console.log('Attempting to connect to:', MONGODB_URI);
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      autoIndex: false,
    });
    isConnected = true;
    //console.log('Connected to MongoDB');
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('MongoDB connection failed:', err);
    }
    throw err;
  }
}

