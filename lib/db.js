import mongoose from 'mongoose';
import Meal from '@/app/meals/models/Meal';
import { NextResponse } from 'next/server';

// let isConnected = false;

// if (isConnected) {
//   console.log("Using existing MongoDB connection");
//   return;
// }


const connect = async () => {
  const MONGODB_URI = process.env.DB_URI;
  if(!MONGODB_URI) {
    throw new Error('DB_URI is not defined');
  }
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
      const meals = await Meal.find().lean();
      // isConnected = true;
      console.log('Connected to MongoDB');
      return NextResponse.json(meals);
    }
  } catch (error) {
    console.error('Error in connecting to DB:', error);
    throw error;
  }
}

export default connect;

