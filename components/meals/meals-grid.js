import connect from "@/lib/db";
import MealItem from "./meal-item";
import styles from "./meals-grid.module.css";
import Meal from "@/app/meals/models/Meal";

export default async function MealsGrid() {
  await connect();
  const meals = await Meal.find({}).lean();
  //console.log(meals.map(meal => console.log("meal----", meal)));

  const transformedMeals = meals.map((meal) => ({
    id: meal._id.toString(),
    title: meal.title || 'Untitled Meal',
    slug: meal.slug || meal._id.toString(), //if slug is empty
    image: meal.image && meal.image !== '' ? meal.image : null,
    summary: meal.summary || 'No summary available',
    creator: meal.creator || 'Unknown',
  }));

  return (
    <ul className={styles.meals}>
      {transformedMeals.map(meal => (
        <li key={meal.id}>
          <MealItem
           title={meal.title}
           slug={meal.slug}
           image={meal.image}
           summary={meal.summary}
           creator={meal.creator}
           />
        </li>
      ))}
    </ul>
  )
}

export const dynamic = 'force-dynamic';