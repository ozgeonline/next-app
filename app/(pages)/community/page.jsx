import Link from 'next/link';
import RecipesCard from '@/components/ui/assets/recipesCard/RecipesCard';
import styles from './page.module.css';

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
};

export default async function CommunityPage() {
  const meals = await getData();

  return (
    <div className={styles.container + ' ' + "mainBackground"}>
      <div className={styles.containerTopNavbar} />
      <header className={styles.header}>
        <h1>
          One shared passion: <span className={styles.highlight}>Food</span>
        </h1>
        <p>Join our community and share your favorite recipes!</p>
      </header>
      
      <main className={styles.main}>
        <section className={styles.section}>
          <h2 className={styles['section-title']}>Latest Recipes</h2>
          {meals.length === 0 ? (
            <p className={styles.error}>
              No meals available. Please try again later or create your own recipe.
            </p>
          ) : (
            <div className={styles['recipe-grid']}>
              <RecipesCard meals={meals}/>
            </div>
          )}
        </section>

        <div className={styles.meals}>
          <h2>Meals Shared</h2>
          <Link href="/meals">Browse Meals</Link>
        </div>

        <section className={styles.section}>
          <h2 className={styles['section-title']}>User Spotlights</h2>
          {meals.length === 0 ? (
            <p className={styles.error}>
              No meals available. Please try again later or create your own recipe.
            </p>
          ) : (
            <div className={styles['spotlight-grid']}>
              <RecipesCard meals={meals} spotlight={true} />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}