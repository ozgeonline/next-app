import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/db';
import Rating from '@/app/models/Rating';
// import mongoose from 'mongoose';
import { getUserFromCookies } from '@/lib/getUserFromCookies';

interface RatingDocument {
  mealId: string;
  userId: string;
  userName: string;
  rating: number;
  createdAt: Date;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ mealId: string }> }) {
  try {
    await connect();

    const decoded = await getUserFromCookies();
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token-user" }, { status: 401 });
    }

    const { mealId } = await params;
    //const mealObjectId = new mongoose.Types.ObjectId(mealId);
    //console.log('GET /api/meals/ratings/[mealId] query:', { mealId, userId: decoded.userId });
    const rating = await Rating.findOne({ mealId, userId: decoded.userId }).lean<RatingDocument>();

    return NextResponse.json({
      message: 'Rating fetched successfully',
      rating: rating ? rating.rating : 0,
      userName: rating ? rating.userName : decoded.name,
    });
  } catch (error) {
    console.error('Error fetching rating:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}







