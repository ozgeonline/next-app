import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/models/User";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import Rating from "@/models/Rating";
import { rateLimit } from "@/lib/rateLimit";

const ACCOUNT_NAME_MIN_LENGTH = 2;
const ACCOUNT_NAME_MAX_LENGTH = 20;

function isMongooseValidationError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "ValidationError"
  );
}

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
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const limitStatus = rateLimit(ip, 20, 60000);

    if (!limitStatus.success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait." },
        { status: 429 }
      );
    }

    await connect();

    const decoded = await getUserFromCookies();
    if (!decoded) {
      return NextResponse.json({ error: "Please log in again." }, { status: 401 });
    }

    const user = await User.findById(decoded.userId).select("name email");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const url = new URL(req.url);
    const basicOnly = url.searchParams.get('basic') === 'true';
    const ratingsOnly = url.searchParams.get('ratings') === 'true';

    // AuthProvider only needs user info — skip ratings query
    if (basicOnly) {
      return NextResponse.json({
        message: "User data fetched successfully",
        user: {
          name: user.name,
          email: user.email,
          userId: user._id.toString()
        },
      });
    }

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
    return NextResponse.json({ error: "Account information could not be loaded." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const limitStatus = rateLimit(ip, 10, 60000);

    if (!limitStatus.success) {
      return NextResponse.json(
        { error: "Too many profile update attempts." },
        { status: 429 }
      );
    }

    await connect();

    const decoded = await getUserFromCookies();
    if (!decoded) {
      return NextResponse.json({ error: "Please log in again." }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Name is required and must be text" }, { status: 400 });
    }

    const trimmedName = name.trim();

    if (trimmedName.length < ACCOUNT_NAME_MIN_LENGTH || trimmedName.length > ACCOUNT_NAME_MAX_LENGTH) {
      return NextResponse.json(
        { error: `Name must be between ${ACCOUNT_NAME_MIN_LENGTH} and ${ACCOUNT_NAME_MAX_LENGTH} characters` },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded?.userId,
      { name: trimmedName },
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

    if (isMongooseValidationError(error)) {
      return NextResponse.json(
        { error: `Name must be between ${ACCOUNT_NAME_MIN_LENGTH} and ${ACCOUNT_NAME_MAX_LENGTH} characters` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Account name could not be updated. Please try again." },
      { status: 500 }
    );
  }
}
