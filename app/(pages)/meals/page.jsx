import { Suspense } from "react";
import { notFound } from "next/navigation";
import RecipeCard from "@/components/ui/cards/recipe-card/RecipeCard";
import { Button } from "@/components/ui/button/Button";
import { getMealsWithRatings } from "@/lib/meals";
import styles from "./page.module.css";
import { Leaf } from "lucide-react";

export const revalidate = 60;

async function MealsList() {
  const meals = await getMealsWithRatings();
  if (!meals || meals.length === 0) return notFound();

  return (
    <div className="grid-cols-1-to-5">
      <RecipeCard spotlight={true} meals={meals} />
    </div>
  );
}

export default function MealsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.watermarkText}>SHARE</div>
      <header className={styles.header}>
        <h1 className={styles.heroTitle}>
          Delicious meals, created
          <span className={styles.highlight}> by you</span>
        </h1>
        <p>Choose your favorite recipe and cook it yourself. It is easy and fun!</p>
        <Button href="/meals/share" variant="primary" className={styles.shareRecipeBtn}>
          Share Your Favorite Recipe
        </Button>

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
  );
}
