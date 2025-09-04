import { Suspense } from "react";
import Link from "next/link";
import MealsGrid from "@/components/meals/meals-grid";
import styles from "./page.module.css";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';
 async function getData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/meals`, {
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

export default async function MealsPage() {
  const meals = await getData();
  if(!meals) return notFound();
  //meals.map(meal => console.log(meal));

  return (
    <div className={styles.container}>
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
        <Suspense 
          fallback={
            <p className={styles.loading}>loading meals...</p>
          }
        >
            {meals.length === 0 ? (
            <p className={styles.error}>No meals available. Please try again later.</p>
          ) : (
            <MealsGrid meals={meals} />
          )}
        </Suspense>
      </main>
    </div>
  )
}