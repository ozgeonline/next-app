import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import RecipesCard from "@/components/assets/recipesCard/RecipesCard";
import { getMealsWithRatings } from "@/lib/meals";
import styles from "./page.module.css";

export const dynamic = 'force-dynamic';

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
      <header className={styles.header}>
        <h1>Delicious meals, created 
          <span className="highlight-gradient-text"> by you</span>
        </h1>
        <p>Choose your favorite recipe and cook it yourself. It is easy and fun!</p>
        <p className={styles.cta}>
          <Link href="/meals/share" className="text-gold-on-dark">
            Share Your Favorite Recipe
          </Link>
        </p>
      </header>
      <main className={styles.main}>
        <Suspense fallback={<p className="loading">loading meals...</p>}>
          <MealsList />
        </Suspense>
      </main>
    </div>
  )
}