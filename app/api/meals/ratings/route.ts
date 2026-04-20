import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connect from '@/lib/db';
import Rating from '@/models/Rating';
import { getUserFromCookies } from '@/lib/getUserFromCookies';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    await connect();

    const decoded = await getUserFromCookies();
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token-user" }, { status: 401 });
    }

    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const limitStatus = rateLimit(ip, 15, 60000);

    if (!limitStatus.success) {
      return NextResponse.json({ error: "Too many rating attempts. Please wait." }, { status: 429 });
    }

    const { mealId, rating } = await req.json();

    if (
      !mealId || !rating ||
      typeof mealId !== "string" || typeof rating !== "number" ||
      rating < 1 || rating > 5 ||
      !mongoose.Types.ObjectId.isValid(mealId)
    ) {
      return NextResponse.json(
        { error: 'Invalid input or meal ID format' },
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