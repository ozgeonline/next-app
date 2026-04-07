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
            <h1 className="highlight-text">{meal.title}</h1>
            <p className={styles.creator}>
              by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
            </p>
            <Link href="./" className="button-gold-blue">
              Back to Meals
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