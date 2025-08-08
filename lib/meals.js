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

  mealData.image = mealData.image.startsWith("http")
    ? mealData.image
    : `/images/${slug}`;

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