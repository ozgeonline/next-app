import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connect from "@/lib/db";
import Favorite from "@/models/Favorite";
import Meal from "@/models/Meal";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import { rateLimit } from "@/lib/rateLimit";

function getClientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for") ?? "127.0.0.1";
}

function toObjectId(id: string) {
  return mongoose.Types.ObjectId.createFromHexString(id);
}

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limitStatus = rateLimit(ip, 60, 60000);

    if (!limitStatus.success) {
      return NextResponse.json({ error: "Too many requests. Please wait." }, { status: 429 });
    }

    await connect();

    const decoded = await getUserFromCookies();
    if (!decoded) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const favorites = await Favorite.find({ userId: decoded.userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "mealId",
        select: "title slug image summary creator averageRating",
      })
      .lean();

    const meals = favorites
      .map((favorite) => favorite.mealId)
      .filter(Boolean)
      .map((meal) => ({
        id: meal._id.toString(),
        title: meal.title,
        slug: meal.slug,
        image: meal.image,
        summary: meal.summary,
        creator: meal.creator,
        averageRating: meal.averageRating || 0,
      }));

    return NextResponse.json({ meals }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Favorite meals could not be loaded." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limitStatus = rateLimit(ip, 30, 60000);

    if (!limitStatus.success) {
      return NextResponse.json({ error: "Too many favorite attempts. Please wait." }, { status: 429 });
    }

    await connect();

    const decoded = await getUserFromCookies();
    if (!decoded) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { mealId } = await req.json();

    if (!mealId || typeof mealId !== "string" || !mongoose.Types.ObjectId.isValid(mealId)) {
      return NextResponse.json({ error: "Invalid meal ID" }, { status: 400 });
    }

    const mealObjectId = toObjectId(mealId);
    const mealExists = await Meal.exists({ _id: mealObjectId });

    if (!mealExists) {
      return NextResponse.json({ error: "Meal not found" }, { status: 404 });
    }

    const existingFavorite = await Favorite.findOne({
      mealId: mealObjectId,
      userId: decoded.userId,
    });

    if (existingFavorite) {
      await Favorite.deleteOne({ _id: existingFavorite._id });
      return NextResponse.json({ isFavorite: false }, { status: 200 });
    }

    await Favorite.create({
      mealId: mealObjectId,
      userId: decoded.userId,
    });

    return NextResponse.json({ isFavorite: true }, { status: 201 });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json({ isFavorite: true }, { status: 200 });
    }

    return NextResponse.json({ error: "Favorite status could not be updated. Please try again." }, { status: 500 });
  }
}
