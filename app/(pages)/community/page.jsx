import Link from 'next/link';
import RecipesCard from '@/components/assets/recipesCard/RecipesCard';
import styles from './page.module.css';

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Community",
  description:
    "Join the community! Share your original recipes, discover others' dishes, and connect with food lovers around the world.",
  keywords: "Meals Share, food, recipes, community"
};

function NoMeals() {
  return (
    <p className={styles.error}>
      No meals available. Please try again later or create your own recipe.
    </p>
  );
}

async function LatestMealsList() {
  const meals = await getData();
  return (
    <>
      {meals.length === 0 ? (
        <NoMeals />
      ) : (
        <div className={styles['recipe-grid']}>
          <RecipesCard meals={meals}/>
        </div>
      )}
    </>
  )
}

async function SpotlightMealsList() {
  const meals = await getData();
  return (
    <>
     {meals.length === 0 ? (
        <NoMeals />
      ) : (
        <div className={styles['spotlight-grid']}>
          <RecipesCard meals={meals} spotlight={true} />
        </div>
      )}
    </>
  )
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
};

export default function CommunityPage() {
  return (
    <div className={styles.container + ' ' + "mainBackground"}>
      <div className="containerTopNavbarColor" />
      <header className={styles.header}>
        <h1>
          One shared passion: <span className="highlight-gradient-text">Food</span>
        </h1>
        <p>Join our community and share your favorite recipes!</p>
      </header>
      
      <main className={styles.main}>
        <section className={styles.section}>
          <h2
            className={styles['section-title']}
          >
            Latest Recipes
          </h2>
          <LatestMealsList />
        </section>

        <div className={styles.meals}>
          <h2>Meals Shared</h2>
          <Link href="/meals" className='text-gold-on-dark'>Browse Meals</Link>
        </div>

        <section className={styles.section}>
          <h2
            className={styles['section-title']}
          >
            User Spotlights
          </h2>
          <SpotlightMealsList />
        </section>
      </main>
    </div>
  );
}