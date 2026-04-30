import RecipesCard from '@/components/ui/cards/recipe-card/RecipeCard';
import { Button } from '@/components/ui/button/Button';
import styles from './page.module.css';
import { ArrowRight, Leaf, Users } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className={styles.pageWrapper}>
      <div className="containerTopNavbarColor" />

      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.watermarkText}>SHARE</div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            One shared passion: <span className={styles.highlight}>Food</span>
          </h1>
          <p className={styles.heroSubtext}>
            Join our community and share your favorite recipes!
          </p>
          <div className={styles.decorativeDivider}>
            <div className={styles.line} />
            <Leaf className={styles.dividerLeaf} size={24} />
            <div className={styles.line} />
          </div>
        </div>
      </section>

      {/* LATEST RECIPES SECTION */}
      <section className={styles.recipesSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleWrapper}>
            <div className={styles.iconCircle}>
              <Leaf className={styles.dividerLeaf} size={20} />
            </div>
            <h2 className={styles.sectionTitle}>Latest Recipes</h2>
          </div>
          <Button
            href="/meals"
            variant="secondary"
            className={styles.viewAllBtn}
            iconRight={<ArrowRight size={18} />}
          >
            View All
          </Button>
        </div>

        <div className={styles.recipeGrid}>
          <RecipesCard />
        </div>
      </section>

      {/* MEALS SHARED BOTTOM SECTION */}
      <section className={styles.mealsSharedSection}>
        <div className={styles.mealsCard}>
          <div className={styles.mealsIconWrapper}>
            <Users size={28} />
          </div>
          <h2 className={styles.mealsTitle}>Meals Shared</h2>
          <p className={styles.mealsSubtext}>
            Discover meals shared by our community and get inspired.
          </p>
          <Button
            href="/meals"
            variant="primary"
            className={styles.browseBtn}
            iconRight={<ArrowRight size={20} />}
          >
            Browse Meals
          </Button>
        </div>
        <div className={styles.bottomWatermark}>SHARE</div>
      </section>
    </div>
  );
}
