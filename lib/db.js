import mongoose from 'mongoose';
import Meal from '@/app/meals/models/Meal';
import { NextResponse } from 'next/server';

// const connect = async () => {
//   const MONGODB_URI = process.env.DB_URI;
//   if(!MONGODB_URI) {
//     throw new Error('DB_URI is not defined');
//   }
//   try {
//     if (mongoose.connection.readyState === 0) {
//       await mongoose.connect(MONGODB_URI);
//       const meals = await Meal.find().lean();
//       // isConnected = true;
//       console.log('Connected to MongoDB');
//       return NextResponse.json(meals);
//     }
//   } catch (error) {
//     console.error('Error in connecting to DB:', error);
//     throw error;
//   }
// }

let isConnected = false;

export default async function connect() {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }
  const MONGODB_URI = process.env.DB_URI;
  if(!MONGODB_URI) {
    throw new Error('DB_URI is not defined');
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s for server selection
      connectTimeoutMS: 10000, // Timeout after 10s for initial connection
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    throw err;
  }
}
// export default connect;

