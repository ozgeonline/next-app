import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/app/models/User";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import Rating from "@/app/models/Rating";
import Meal from "@/app/models/Meal";

export async function GET(req: Request) {
  try {
    await connect();

    const decoded = await getUserFromCookies();
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token-user" }, { status: 401 });
    }

    const user = await User.findById(decoded.userId).select("name email");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const url = new URL(req.url);
    const ratingsOnly = url.searchParams.get('ratings') === 'true';

    if (ratingsOnly) {
      const ratings = await Rating.find({ userId: decoded.userId })
        .populate({ path: 'mealId', select: 'title slug' })
        .lean();
        
      const userRatings = ratings.map((rating) => ({
        mealId: rating.mealId._id.toString(),
        mealTitle: rating.mealId.title,
        mealSlug: rating.mealId.slug,
        rating: rating.rating,
        createdAt: rating.createdAt,
      }));

      return NextResponse.json({
        message: 'User ratings fetched successfully',
        ratings: userRatings,
      });
    }

    return NextResponse.json({
      message: "User data fetched successfully",
      user: { 
        name: user.name, 
        email: user.email, 
        userId: user._id 
      },
      ratings: await Rating.find({ userId: decoded.userId })
      // .populate('mealId', 'title slug').lean()
      .populate({ path: 'mealId', select: 'title slug'}).lean()
    });

  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
export async function PUT(req: Request) {
  try {
    await connect();

    const decoded = await getUserFromCookies();
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token-user" }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded?.userId,
      { name },
      { new: true }
    ).select("name email");

    return NextResponse.json({
      message: "User updated successfully",
      user: {
        name: updatedUser?.name,
        email: updatedUser?.email,
        userId: updatedUser?._id,
      },
    });
  } catch (error) {
    //console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
