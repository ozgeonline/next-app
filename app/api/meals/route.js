import { NextResponse } from "next/server";
import connect from "@/lib/db";
import Meal from "@/app/meals/models/Meal";
import { seedDatabase } from "@/seed";


export const GET = async () => {
  try {
    await connect();
    await seedDatabase();

    const meals = await Meal.find({}).lean();
    return NextResponse.json(meals, { status: 200 });
  } catch (err) {
    console.error('Error in /api/meals:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
  


}