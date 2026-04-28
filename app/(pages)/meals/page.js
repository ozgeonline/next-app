// Meals page:
// displays a list of meals with ratings and a link to share a new meal.
// lists shared dishes

import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import RecipesCard from "@/components/ui/cards/recipe-card/RecipeCard";
import { getMealsWithRatings } from "@/lib/meals";
import styles from "./page.module.css";
import { Leaf } from "lucide-react";

export const revalidate = 60;

async function MealsList() {
  const meals = await getMealsWithRatings();
  if(!meals || meals.length === 0) return notFound();
  return (
    <div className="grid-cols-1-to-5">
      <RecipesCard spotlight={true} meals={meals} />
    </div>
  );
}

export default function MealsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.watermarkText}>SHARE</div>
      <header className={styles.header}>
        <h1 className={styles.heroTitle}>Delicious meals, created 
          <span className={styles.highlight}> by you</span>
        </h1>
        <p>Choose your favorite recipe and cook it yourself. It is easy and fun!</p>
        <div>
          <Link href="/meals/share" className={styles.shareRecipeBtn}>
            Share Your Favorite Recipe
          </Link>
        </div>

        <div className={styles.decorativeDivider}>
          <div className={styles.line} />
          <Leaf className={styles.dividerLeaf} size={24} />
          <div className={styles.line} />
        </div>
        
      </header>
      <main className={styles.main}>
        <Suspense fallback={<p className="loading">loading meals...</p>}>
          <MealsList />
        </Suspense>
      </main>
    </div>
  )
}