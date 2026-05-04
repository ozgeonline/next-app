import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import connect from "@/lib/db";
import Favorite from "@/models/Favorite";
import Meal from "@/models/Meal";
import Rating from "@/models/Rating";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import { rateLimit } from "@/lib/rateLimit";
import {
  buildSharedMealOwnerQuery,
  createUniqueMealSlug,
  isValidMealId,
  validateSharedMealInput,
} from "@/lib/sharedMeals";

function getClientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for") ?? "127.0.0.1";
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const limitStatus = rateLimit(getClientIp(req), 20, 60000);

    if (!limitStatus.success) {
      return NextResponse.json({ error: "Too many update attempts. Please wait." }, { status: 429 });
    }

    await connect();

    const decoded = await getUserFromCookies();
    if (!decoded) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { id } = await context.params;
    if (!isValidMealId(id)) {
      return NextResponse.json({ error: "Invalid meal ID" }, { status: 400 });
    }

    const body = await req.json();
    const validation = validateSharedMealInput(body);

    if (validation.error) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const meal = await Meal.findOne(buildSharedMealOwnerQuery(decoded, id));
    if (!meal || !validation.data) {
      return NextResponse.json({ error: "Meal not found or not authorized" }, { status: 404 });
    }

    const previousSlug = meal.slug;

    meal.title = validation.data.title;
    meal.summary = validation.data.summary;
    meal.instructions = validation.data.instructions;
    meal.slug = await createUniqueMealSlug(validation.data.title, id);

    await meal.save();

    revalidatePath("/meals");
    revalidatePath(`/meals/${previousSlug}`);
    revalidatePath(`/meals/${meal.slug}`);
    revalidatePath("/sharedmeals");

    return NextResponse.json({
      meal: {
        id: meal._id.toString(),
        title: meal.title,
        slug: meal.slug,
        image: meal.image,
        summary: meal.summary,
        instructions: meal.instructions,
        updatedAt: meal.updatedAt,
        averageRating: meal.averageRating || 0,
      },
    });
  } catch {
    return NextResponse.json({ error: "Meal could not be updated. Please try again." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const limitStatus = rateLimit(getClientIp(req), 10, 60000);

    if (!limitStatus.success) {
      return NextResponse.json({ error: "Too many delete attempts. Please wait." }, { status: 429 });
    }

    await connect();

    const decoded = await getUserFromCookies();
    if (!decoded) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { id } = await context.params;
    if (!isValidMealId(id)) {
      return NextResponse.json({ error: "Invalid meal ID" }, { status: 400 });
    }

    const meal = await Meal.findOne(buildSharedMealOwnerQuery(decoded, id));
    if (!meal) {
      return NextResponse.json({ error: "Meal not found or not authorized" }, { status: 404 });
    }

    await Promise.all([
      Favorite.deleteMany({ mealId: meal._id }),
      Rating.deleteMany({ mealId: meal._id }),
      meal.deleteOne(),
    ]);

    revalidatePath("/meals");
    revalidatePath(`/meals/${meal.slug}`);
    revalidatePath("/sharedmeals");

    return NextResponse.json({ message: "Meal deleted successfully" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Meal could not be deleted. Please try again." }, { status: 500 });
  }
}
