import mongoose from "mongoose";
import slugify from "slugify";
import xss from "xss";
import Meal from "@/models/Meal";

export type AuthenticatedUser = {
  userId: string;
  name?: string;
  email?: string;
};

export type SharedMealInput = {
  title: unknown;
  summary: unknown;
  instructions: unknown;
};

const MAX_SLUG_ATTEMPTS = 50;

type SlugLookupMeal = {
  _id: { toString: () => string };
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function buildSharedMealOwnerQuery(user: AuthenticatedUser, mealId?: string) {
  const ownershipConditions: Array<Record<string, unknown>> = [
    { creatorId: user.userId },
  ];

  if (user.email) {
    ownershipConditions.push({
      creatorId: { $exists: false },
      creator_email: user.email,
    });
  }

  return {
    ...(mealId ? { _id: mealId } : {}),
    $or: ownershipConditions,
  };
}

export function validateSharedMealInput(input: SharedMealInput) {
  if (!isNonEmptyString(input.title)) {
    return { error: "Title is required." };
  }

  if (!isNonEmptyString(input.summary)) {
    return { error: "Summary is required." };
  }

  if (!isNonEmptyString(input.instructions)) {
    return { error: "Instructions are required." };
  }

  const title = xss(input.title.trim());
  const summary = xss(input.summary.trim());
  const instructions = xss(input.instructions.trim());

  if (title.length > 100) {
    return { error: "Title must be 100 characters or fewer." };
  }

  if (summary.length > 300) {
    return { error: "Summary must be 300 characters or fewer." };
  }

  if (instructions.length > 5000) {
    return { error: "Instructions must be 5000 characters or fewer." };
  }

  return {
    data: {
      title,
      summary,
      instructions,
    },
  };
}

export async function createUniqueMealSlug(title: string, currentMealId?: string) {
  const baseSlug = slugify(title, { lower: true, strict: true }) || "meal";
  let slug = baseSlug;
  let counter = 1;

  while (counter <= MAX_SLUG_ATTEMPTS) {
    const existingMeal = await Meal.findOne({ slug }).select("_id").lean<SlugLookupMeal | null>();

    if (!existingMeal || existingMeal._id.toString() === currentMealId) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  throw new Error("Could not generate a unique slug. Please try a different title.");
}

export function isValidMealId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}
