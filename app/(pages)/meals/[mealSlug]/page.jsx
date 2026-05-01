import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ChefHat, Info } from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import FavoriteButton from "@/components/favorites/favorite-button/FavoriteButton";
import Favorite from "@/models/Favorite";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import styles from "./page.module.css";
import { getMeal } from "@/lib/meals";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }) {
  const { mealSlug } = await params;
  const meal = await getMeal(mealSlug);

  if (!meal) return notFound();

  return {
    title: meal.title,
    description: meal.summary,
  };
}

export default async function MealDetailsPage({ params }) {
  const { mealSlug } = await params;
  const [meal, user] = await Promise.all([
    getMeal(mealSlug),
    getUserFromCookies(),
  ]);

  if (!meal) return notFound();

  const mealId = meal._id.toString();
  const userId = user?.userId || null;
  const favorite = userId
    ? await Favorite.findOne({ mealId, userId }).select("_id").lean()
    : null;

  return (
    <div className={styles.container}>
      <div className={styles.layoutWrapper}>
        <div className={styles.leftColumn}>
          <Button
            href="/meals"
            variant="plain"
            className={styles.backButton}
            iconLeft={<ArrowLeft size={16} />}
          >
            Back to meals
          </Button>
          <div className={styles.imageContainer}>
            <Image src={meal.image} alt={meal.title} fill className={styles.archedImage} />
          </div>
        </div>

        <main className={styles.main}>
          <header className={styles.header}>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>{meal.title}</h1>
              <FavoriteButton
                mealId={mealId}
                initialIsFavorite={Boolean(favorite)}
                isAuthenticated={Boolean(userId)}
              />
            </div>
            <p className={styles.creator}>
              <ChefHat size={18} className={styles.creatorIcon}/> Recipe by <span>{meal.creator}</span>
            </p>
            <p className={styles.summary}>{meal.summary}</p>
          </header>

          <section className={styles.instructionsSection}>
            <div className={styles.sectionHeader}>
              <div className={styles.iconCircle}><Info size={18} /></div>
              <h2>Instructions</h2>
            </div>
            <ul className={styles.instructionsList}>
              {meal.instructions.split("\n").filter((line) => line.trim()).map((line, index) => (
                <li key={`${index}-${line}`}>
                  <span className={styles.stepNumber}>{index + 1}</span>
                  <p>{line.trim()}</p>
                </li>
              ))}
            </ul>
          </section>
        </main>

      </div>
    </div>
  );
}
