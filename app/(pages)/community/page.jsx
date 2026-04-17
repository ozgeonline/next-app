import Link from 'next/link';
import RecipesCard from '@/components/ui/cards/recipe-card/RecipeCard';
import WavesBackground from '@/components/ui/backgrounds/wavesBackground/WavesBackground';
import styles from './page.module.css';

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Community",
  description:
    "Join the community! Share your original recipes, discover others' dishes, and connect with food lovers around the world.",
  keywords: "Meals Share, food, recipes, community"
};

export default function CommunityPage() {
  return (
    <div className={`${styles.container} mainBackground`}>
      <WavesBackground />
      <div className="containerTopNavbarColor" />
      <header className={styles.header}>
        <h1>
          One shared passion: <span className="highlight-text">Food</span>
        </h1>
        <p>Join our community and share your favorite recipes!</p>
      </header>

      <main className={styles.main}>
        <section className={styles.section}>
          <h2 className={styles['section-title']}>
            Latest Recipes
          </h2>
          <div className="grid-cols-2-to-5">
            <RecipesCard spotlight={false} />
          </div>
        </section>

        <div className={styles.meals}>
          <h2>Meals Shared</h2>
          <Link href="/meals" className='accent-link-button'>Browse Meals</Link>
        </div>

        <section className={styles.section}>
          <h2 className={styles['section-title']}>
            User Spotlights
          </h2>
          <div className="grid-cols-1-to-5">
            <RecipesCard spotlight={true} />
          </div>
        </section>
      </main>
    </div>
  );
}