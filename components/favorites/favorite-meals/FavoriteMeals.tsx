"use client";

import Image from "next/image";
import useSWR from "swr";
import { Button } from "@/components/ui/button/Button";
import FavoriteButton from "@/components/favorites/favorite-button/FavoriteButton";
import styles from "./favorite-meals.module.css";
import { ArrowLeft, ArrowRight, Heart } from "lucide-react";

type FavoriteMeal = {
  id: string;
  title: string;
  slug: string;
  image: string;
  summary: string;
  creator: string;
  averageRating: number;
};

type FavoriteMealsResponse = {
  meals: FavoriteMeal[];
};

const fetcher = async (url: string): Promise<FavoriteMealsResponse> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch favorite meals");
  return response.json();
};

export default function FavoriteMeals() {
  const { data, error, isLoading, mutate } = useSWR<FavoriteMealsResponse>("/api/meals/favorites", fetcher);
  const meals = data?.meals || [];

  const removeMealFromList = (mealId: string) => {
    mutate(
      (current) => ({
        meals: current?.meals.filter((meal) => meal.id !== mealId) || [],
      }),
      { revalidate: false }
    );
  };

  return (
    <section className={styles.favoriteSection}>
      <div className={styles.sectionHeader}>
        <div>
          <h3 className={styles.sectionTitle}>Favorite Meals</h3>
          <p className={styles.sectionSub}>Meals you saved for later.</p>
        </div>
        <div className={styles.headerActions}>
          <Heart size={20} className={styles.sectionIcon} />
          <Button
            href="/profile"
            variant="plain"
            className={styles.backToProfileButton}
            iconLeft={<ArrowLeft size={16} />}
          >
            Back to profile
          </Button>
        </div>
      </div>

      {isLoading && <p className={styles.emptyText}>Loading favorite meals...</p>}
      {error && <p className={styles.errorText}>Favorite meals could not be loaded.</p>}

      {!isLoading && !error && meals.length === 0 && (
        <p className={styles.emptyText}>You have not added any favorite meals yet.</p>
      )}

      {meals.length > 0 && (
        <div className={styles.favoriteGrid}>
          {meals.map((meal) => (
            <article key={meal.id} className={styles.favoriteCard}>
              <div className={styles.imageWrapper}>
                <Image src={meal.image} alt={meal.title} fill className={styles.mealImage} />
                <div className={styles.favoriteControl}>
                  <FavoriteButton
                    mealId={meal.id}
                    initialIsFavorite
                    isAuthenticated
                    compact
                    onChange={(isFavorite) => {
                      if (!isFavorite) removeMealFromList(meal.id);
                    }}
                  />
                </div>
              </div>
              <div className={styles.cardBody}>
                <p className={styles.creator}>By {meal.creator}</p>
                <h4 className={styles.mealTitle}>{meal.title}</h4>
                <p className={styles.summary}>{meal.summary}</p>
                <Button
                  href={`/meals/${meal.slug}`}
                  variant="plain"
                  className={styles.viewButton}
                  iconRight={<ArrowRight size={15} />}
                >
                  View Meal
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
