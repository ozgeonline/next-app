import { notFound } from "next/navigation";
import Link from "next/link";
import connect from "@/lib/db";
import Meal from "@/app/models/Meal";
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

  const formattedInstructions = meal.instructions
    .replace(/\n/g, "<br>")
    .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.image}>
          <Image src={meal.image} alt={meal.title} fill />
        </div>
        <div className={styles.headerText}>
          <div className={styles["headerText-items"]}>
            <h1 className="highlight-gradient-text">{meal.title}</h1>
            <p className={styles.creator}>
              by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
            </p>
            <Link href="./" className="button-gold-blue">
              back meals
            </Link>
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <h2><span>{meal.title}&#39;s</span> instructions</h2>
        <div 
          className={styles.instructions}
          dangerouslySetInnerHTML={{
            __html: formattedInstructions
          }}
        ></div>
      </main>
    </div>
  )
}