import Link from 'next/link';
import RecipesCard from '@/components/ui/assets/recipesCard/RecipesCard';
import styles from './page.module.css';

export default function CommunityPage() {
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
          <h2 className={styles['section-title']}>Trending Recipes</h2>
          <div className={styles['recipe-grid']}>
            <RecipesCard />
            <RecipesCard />
            <RecipesCard />
            <RecipesCard />
            <RecipesCard />
          </div>
        </section>

        <div className={styles.meals}>
          <h2>Meals Shared</h2>
          <Link href="/meals">Browse Meals</Link>
        </div>

        <section className={styles.section}>
          <h2 className={styles['section-title']}>User Spotlights</h2>
          <div className={styles["spotlight-grid"]}>
            <RecipesCard spotlight={true} />
            <RecipesCard spotlight={true} />
            <RecipesCard spotlight={true} />
            <RecipesCard spotlight={true} />
            <RecipesCard spotlight={true} />
            <RecipesCard spotlight={true} />
            <RecipesCard spotlight={true} />
          </div>
        </section>
      </main>
    </div>
  );
}