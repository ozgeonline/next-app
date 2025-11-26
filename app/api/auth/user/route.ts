import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/app/models/User";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import Rating from "@/app/models/Rating";

export async function GET(req: Request) {

  const formatRatings = (ratings: any[]) => {
    return ratings.map((rating) => {
      const meal = rating.mealId;
      return {
        _id: rating._id.toString(),
        mealId: meal ? meal._id.toString() : null,
        mealTitle: meal ? meal.title : "Silinmiş Yemek",
        mealSlug: meal ? meal.slug : null,
        rating: rating.rating,
        createdAt: rating.createdAt,
      };
    });
  };

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

    const ratingsQuery = Rating.find({ userId: decoded.userId })
      .populate({ path: 'mealId', select: 'title slug' })
      .lean();

    if (ratingsOnly) {
      const ratings = await ratingsQuery;
      return NextResponse.json({
        message: 'User ratings fetched successfully',
        ratings: formatRatings(ratings),
      });
    };

    const ratings = await ratingsQuery;

    return NextResponse.json({
      message: "User data fetched successfully",
      user: {
        name: user.name,
        email: user.email,
        userId: user._id.toString()
      },
      ratings: formatRatings(ratings),
    });

  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error fetching user data:", error);
    }
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
      { name: name.trim() },
      { new: true, runValidators: true }
    ).select("name email");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User updated successfully",
      user: {
        name: updatedUser?.name,
        email: updatedUser?.email,
        userId: updatedUser?._id.toString(),
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Error updating user:", error);
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
