import { NextResponse } from 'next/server';
import connect from '@/lib/db';
import Meal from '@/app/models/Meal';

export const GET = async () => {
  try {
    await connect();

    const mealsWithRatings = await Meal.aggregate([
      {
        $lookup: { //matching
          from: "ratings", //<collection to join>
          localField: "_id", // <field from the input docs> Meal._id
          foreignField: "mealId", // <field from the docs of the Rating collection> Rating.mealId
          pipeline: [{ $project: { rating: 1 } }], //select fields
          as: "ratings", // <output array field> meals.ratings
        },
      },
      {
        $addFields: {
          ratingCount: { $size: "$ratings" }, //total number of items
          averageRating: {
            $cond: [ //<boolean-expression>
              { $gt: [{ $size: "$ratings" }, 0] }, //Compares two values 
              { $avg: "$ratings.rating" }, //average
              0,
            ],
          },
        },
      },
      {
        $project: {
          id: { $toString: "$_id" },
          title: { $ifNull: ["$title", "Untitled Meal"] },
          slug: { $ifNull: ["$slug", { $toString: "$_id" }] },
          instructions: { $ifNull: ["$instructions", "No instructions available"] },
          image: {
            $cond: [
              { $and: ["$image", { $ne: ["$image", ""] }] }, //and:expression operator 
              "$image",
              null,
            ],
          },
          summary: { $ifNull: ["$summary", "No summary available"] },
          creator: { $ifNull: ["$creator", "Unknown"] },
          creator_email: { $ifNull: ["$creator_email", ""] },
          averageRating: 1,
          ratingCount: 1,
        },
      },
    ]);

    //console.log('GET /api/meals mealsWithRatings:', mealsWithRatings);
    return NextResponse.json(mealsWithRatings, { status: 200 });
  } catch (err: any) {
    console.error("Error in /api/meals/meal:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};