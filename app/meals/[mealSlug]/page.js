import connect from "@/lib/db";
import { notFound } from "next/navigation";
import Meal from "@/app/meals/models/Meal";
import Image from "next/image";
import styles from "./page.module.css";

await connect();
export async function generateMetadata({params}) {
  const { mealSlug } = await params;
  const meal = await Meal.findOne({ slug: mealSlug }).lean();

  if (!meal) return notFound();

  return {
    title: meal.title,
    description: meal.summary,
  };
}

export default async function MealDetailsPage({params}) {
  const { mealSlug } = await params;
  const meal = await Meal.findOne({ slug: mealSlug }).lean();

  if (!meal) return notFound();

  const formattedInstructions = meal.instructions.replace(/\n/g, "<br>");
  
  return (
    <>
      <header className={styles.header}>
        <div className={styles.image}>
          <Image src={meal.image} alt={meal.title} fill />
        </div>
        <div  className={styles.headerText}>
          <h1>{meal.title}</h1>
          <p className={styles.creator}>
            by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
          </p>
          <p className={styles.summary}>
            {meal.summary}
          </p>
        </div>
      </header>
      <main>
        <p 
          className={styles.instructions}
          dangerouslySetInnerHTML={{
            __html: formattedInstructions
          }}
        ></p>
      </main>
    </>
  )
}