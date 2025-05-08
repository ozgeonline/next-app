import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Meal from "@/app/meals/models/Meal";
import { dummyMeals, seedDatabase } from "@/seed";


export const GET = async () => {
  try {
    await connect();
    await seedDatabase();

    const meals = await Meal.find({}).lean();
    return NextResponse.json(meals, { status: 200 });



    // const mealCount = await Meal.countDocuments();
    // if (mealCount === 0) {
    //   await Meal.insertMany(dummyMeals);
    //   console.log('Database seeded with dummy meals');
    // }
    // return new NextResponse(JSON.stringify(dummyMeals), {status: 200});
  } catch (err) {
    console.error('Error in /api/meals:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
  


}