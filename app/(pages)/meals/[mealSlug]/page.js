// Meal detail page:
// displays a single meal's image, creator info, and step-by-step instructions based on the URL slug.

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import { getMeal } from "@/lib/meals";

export const dynamic = "force-dynamic";
export async function generateMetadata({params}) {
  const { mealSlug } = await params;
  const meal = await getMeal(mealSlug);

  if (!meal) return notFound();

  return {
    title: meal.title,
    description: meal.summary,
  };
}

export default async function MealDetailsPage({params}) {
  const { mealSlug } = await params;
  const meal = await getMeal(mealSlug);

  if (!meal) return notFound();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.image}>
          <Image src={meal.image} alt={meal.title} fill />
        </div>
        <div className={styles.headerText}>
          <div className={styles["headerText-items"]}>
            <h1 className="highlight-text">{meal.title}</h1>
            <div className={styles.creator}>
              by <span>{meal.creator}</span>
            </div>
            <Link href="/meals" className="button-gold-blue">
              Back to Meals
            </Link>
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <h2><span>{meal.title}&#39;s</span> instructions</h2>
        <ul className={styles.instructions}>
          {meal.instructions.split('\n').filter(line => line.trim()).map((line, i) => (
            <li key={i}>{line.trim()}</li>
          ))}
        </ul>
      </main>
    </div>
  )
}