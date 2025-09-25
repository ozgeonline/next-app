import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/db';
import Rating from '@/app/models/Rating';
import Meal from '@/app/models/Meal';
import mongoose from 'mongoose';
import { getUserFromCookies } from '@/lib/getUserFromCookies';

export async function POST(req: NextRequest) {
  try {
    await connect();

    const decoded = await getUserFromCookies();
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token-user" }, { status: 401 });
    }

    const { mealId, rating } = await req.json();

    if (!mealId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    const objectId = typeof mealId === "string"
      ? mongoose.Types.ObjectId.createFromHexString(mealId)
      : mealId;

    const existingRating = await Rating.findOne(
      {
        mealId:objectId,
        userId: decoded.userId
      }
    );

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.userName = decoded.name;
      await existingRating.save();
    } else {
      await Rating.create({
        mealId :objectId,
        userId: decoded.userId,
        userName : decoded.name,
        rating,
      });
    }

    const ratings = await Rating.find({ mealId });
    const totalRatings = ratings.length;
    const sumRatings = ratings.reduce((sum: number, r: any) => sum + r.rating, 0);
    const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

    await Meal.updateOne(
      { _id: mealId },
      { $set: { averageRating }}
    );

    return NextResponse.json(
      {
        message: 'Rating submitted',
        averageRating,
        totalRatings,
        userName: decoded.name,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error submitting rating:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}