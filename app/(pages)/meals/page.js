// import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import RecipesCard from "@/components/assets/recipesCard/RecipesCard";
import styles from "./page.module.css";

export const dynamic = 'force-dynamic';

async function MealsList() {
  const meals = await getData();
  if(!meals || meals.length === 0) return notFound();
  return (
    <div className={styles['meals-grid']}>
      <RecipesCard spotlight={true} meals={meals} />
    </div>
  );
}

async function getData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/meals/meal`, {
      cache: 'no-cache',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching meals:', error);
    return []; 
  }
}

export default function MealsPage() {
  return (
    <div className={styles.container + ' ' + "mainBackground"}>
      <header className={styles.header}>
        <h1>Delicious meals, created 
          <span className={styles.highlight}> by you</span>
        </h1>
        <p>Choose your favorite recipe and cook it yourself. It is easy and fun!</p>
        <p className={styles.cta}>
          <Link href="/meals/share">
            Share Your Favorite Recipe
          </Link>
        </p>
      </header>
      <main className={styles.main}>
        {/* <Suspense fallback={<p className={styles.loading}>loading meals...</p>}> */}
          <MealsList />
        {/* </Suspense> */}
      </main>
    </div>
  )
}