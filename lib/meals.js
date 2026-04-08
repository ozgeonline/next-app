import slugify from "slugify";
import xss from "xss";
import connect from "@/lib/db";
import Meal from "@/app/models/Meal";
import { cache } from "react";

const MAX_SLUG_ATTEMPTS = 50;

export async function saveMeal(mealData) {
  await connect();

  const { title, summary, instructions, creator, creator_email, image } = mealData;

  if (!title || !summary || !instructions || !creator || !creator_email || !image) {
    throw new Error("Missing required meal fields.");
  }

  const sanitized = {
    ...mealData,
    title: xss(title),
    summary: xss(summary),
    instructions: xss(instructions),
    creator: xss(creator),
    creator_email: xss(creator_email),
  };

  // Unique slug with max attempts guard 
  let slug = slugify(sanitized.title, { lower: true });
  let counter = 1;

  while (await Meal.findOne({ slug })) {
    if (counter >= MAX_SLUG_ATTEMPTS) {
      throw new Error("Could not generate a unique slug. Please try a different title.");
    }
    slug = `${slugify(sanitized.title, { lower: true })}-${counter}`;
    counter++;
  }

  sanitized.slug = slug;

  const meal = new Meal(sanitized);
  await meal.save();
}

export const getMeal = cache(async (slug) => {
  await connect();
  const meal = await Meal.findOne({ slug }).lean();
  return meal;
});

export const getMeals = cache(async () => {
  await connect();
  const meals = await Meal.find().lean();
  return meals;
});

export async function getMealsWithRatings() {
  await connect();
  const meals = await Meal.aggregate([
    {
      $lookup: {
        from: "ratings",
        localField: "_id",
        foreignField: "mealId",
        as: "ratings",
      },
    },
    {
      $addFields: {
        ratingCount: { $size: "$ratings" },
        averageRating: {
          $cond: [
            { $gt: [{ $size: "$ratings" }, 0] },
            { $avg: "$ratings.rating" },
            0,
          ],
        },
      },
    },
    {
      $project: {
        ratings: 0,
      }
    }
  ]);

  return meals;
}