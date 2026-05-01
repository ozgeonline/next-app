import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/db";
import Meal from "@/models/Meal";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import { rateLimit } from "@/lib/rateLimit";
import { buildSharedMealOwnerQuery } from "@/lib/sharedMeals";

type SharedMealDocument = {
  _id: { toString: () => string };
  title: string;
  slug: string;
  image: string;
  summary: string;
  instructions: string;
  createdAt: Date;
  updatedAt?: Date;
  averageRating?: number;
};

function getClientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for") ?? "127.0.0.1";
}

export async function GET(req: NextRequest) {
  try {
    const limitStatus = rateLimit(getClientIp(req), 60, 60000);

    if (!limitStatus.success) {
      return NextResponse.json({ error: "Too many requests. Please wait." }, { status: 429 });
    }

    await connect();

    const decoded = await getUserFromCookies();
    if (!decoded) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const meals = await Meal.find(buildSharedMealOwnerQuery(decoded))
      .sort({ createdAt: -1 })
      .select("title slug image summary instructions createdAt updatedAt averageRating")
      .lean<SharedMealDocument[]>();

    return NextResponse.json({
      meals: meals.map((meal) => ({
        id: meal._id.toString(),
        title: meal.title,
        slug: meal.slug,
        image: meal.image,
        summary: meal.summary,
        instructions: meal.instructions,
        createdAt: meal.createdAt,
        updatedAt: meal.updatedAt,
        averageRating: meal.averageRating || 0,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
