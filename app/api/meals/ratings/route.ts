import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connect from '@/lib/db';
import Rating from '@/app/models/Rating';
import { getUserFromCookies } from '@/lib/getUserFromCookies';

export async function POST(req: NextRequest) {
  try {
    await connect();

    const decoded = await getUserFromCookies();
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token-user" }, { status: 401 });
    }

    const { mealId, rating } = await req.json();
    //console.log('POST /api/meals/ratings received:', { mealId, rating, userId: decoded.userId });

    if (!mealId || !rating || rating < 1 || rating > 5) {
      //console.log('Invalid input defined');
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
        mealId: objectId,
        userId: decoded.userId
      }
    );
    //console.log('Existing rating found:', existingRating ? existingRating._id : 'null');

    if (existingRating) {
      //console.log('Updating existing rating to:', rating);
      existingRating.rating = rating;
      existingRating.userName = decoded.name;
      await existingRating.save();
      //console.log('Update result:', await Rating.findById(existingRating._id));
    } else {
      //console.log('Creating new rating:', rating);
      await Rating.create({
        mealId: objectId,
        userId: decoded.userId,
        userName: decoded.name,
        rating,
      });
    }

    const stats = await Rating.aggregate([
      { $match: { mealId: objectId } },
      {
        $group: {
          _id: "$mealId",
          averageRating: { $avg: "$rating" },
          totalRatings: { $count: {} }
        }
      }
    ]);

    const averageRating = stats.length > 0 ? stats[0].averageRating : 0;
    const totalRatings = stats.length > 0 ? stats[0].totalRatings : 0;

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