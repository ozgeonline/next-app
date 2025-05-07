import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Meal from "@/app/meals/models/Meal";
import { dummyMeals } from "@/seed";

export const GET = async () => {
  try {
    await connect();
    const mealCount = await Meal.countDocuments();

    if (mealCount === 0) {
      await Meal.insertMany(dummyMeals);
      console.log('Database seeded with dummy meals');
    }
    return new NextResponse(JSON.stringify(dummyMeals), {status: 200});
  } catch (err) {
    return new NextResponse(err.message, {status: 500});
  }
  


}