import slugify from "slugify";
import xss from "xss";
import connect from "@/lib/db";
import Meal from "@/app/models/Meal";

export async function saveMeal(mealData) {
  await connect();

  mealData.title = xss(mealData.title);
  mealData.summary = xss(mealData.summary);
  mealData.instructions = xss(mealData.instructions);
  mealData.creator = xss(mealData.creator);
  mealData.creator_email = xss(mealData.creator_email);

  //unique slug
  let slug = slugify(mealData.title, { lower: true });
  let counter = 1;
  while (await Meal.findOne({ slug })) {
    slug = `${slugify(mealData.title, { lower: true })}-${counter}`;
    counter++;
  }
  mealData.slug = slug;

  // create & save meal
  const meal = new Meal(mealData);
  await meal.save();
}

export async function getMeals() {
  await connect();
  const meals = await Meal.find().lean();
  if (!meals || meals.length === 0) {
    throw new Error("No meals found in getMeals()");
  }
  return meals;
}

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