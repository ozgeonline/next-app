// Meal detail page:
// displays a single meal's image, creator info, and step-by-step instructions based on the URL slug.

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChefHat, Info } from 'lucide-react';
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
      <div className={styles.layoutWrapper}>
        
        {/* LEFT COLUMN: HERO IMAGE */}
        <div className={styles.leftColumn}>
          <Link href="/meals" className={styles.backButton}>
            <ArrowLeft size={16} /> Back to meals
          </Link>
          <div className={styles.imageContainer}>
            <Image src={meal.image} alt={meal.title} fill className={styles.archedImage} />
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILS & INSTRUCTIONS */}
        <main className={styles.main}>
          <header className={styles.header}>
            <h1 className={styles.title}>{meal.title}</h1>
            <p className={styles.creator}>
              <ChefHat size={18} className={styles.creatorIcon}/> Recipe by <span>{meal.creator}</span>
            </p>
            <p className={styles.summary}>{meal.summary}</p>
          </header>

          <section className={styles.instructionsSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.iconCircle}><Info size={18} /></div>
              <h2>Instructions</h2>
            </div>
            <ul className={styles.instructionsList}>
              {meal.instructions.split('\n').filter(line => line.trim()).map((line, i) => (
                <li key={i}>
                  <span className={styles.stepNumber}>{i + 1}</span>
                  <p>{line.trim()}</p>
                </li>
              ))}
            </ul>
          </section>
        </main>

      </div>
    </div>
  )
}