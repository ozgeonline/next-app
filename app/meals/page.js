import { Suspense } from "react";
import Link from "next/link";
import MealsGrid from "@/components/meals/meals-grid";
import styles from "./page.module.css";
import { notFound } from "next/navigation";

async function getData() {
  const res = await fetch('http://localhost:3000/api/meals', { cache: 'no-cache' });
  if (!res.ok) return notFound();
  return res.json();
}

export default async function MealsPage() {
  const meals = await getData();
  // meals.map(meal => console.log(meal));

  return (
    <>
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
           <MealsGrid meals={meals}/>
        </Suspense>
      </main>
    </>
  )
}