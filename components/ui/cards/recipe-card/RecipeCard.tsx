import Image from "next/image";
import { cache } from "react";
import mongoose from "mongoose";
import connect from "@/lib/db";
import Meal from "@/models/Meal";
import Favorite from "@/models/Favorite";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import FavoriteButton from "@/components/favorites/favorite-button/FavoriteButton";
import RatingStars from "@/components/meals/rating-stars/RatingStars";
import { Button } from "@/components/ui/button/Button";
import styles from "./recipe-card.module.css";
import { Star, ArrowRight, Utensils, User } from "lucide-react";

const RATING_STARS = 5;

type MealCardData = {
  _id?: { toString: () => string } | string;
  id?: string;
  title?: string;
  slug?: string;
  image?: string;
  summary?: string;
  creator?: string;
  averageRating?: number;
  ratingCount?: number;
};

type RecipeCardProps = {
  meals?: MealCardData[];
  spotlight?: boolean;
};

function normalizeMeal(meal: MealCardData) {
  const id = meal.id || meal._id?.toString() || meal.slug || meal.title || "meal";

  return {
    id,
    title: meal.title || "Untitled Meal",
    slug: meal.slug || id,
    image: meal.image || "/logo.png",
    summary: meal.summary || "No summary available",
    creator: meal.creator || "Unknown",
    averageRating: meal.averageRating || 0,
    ratingCount: meal.ratingCount || 0,
    category: "Recipe",
  };
}

const getTopRecipes = cache(async () => {
  await connect();

  const mealsData = await Meal.aggregate([
    { $sort: { createdAt: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "ratings",
        localField: "_id",
        foreignField: "mealId",
        as: "mealRatings"
      }
    },
    {
      $project: {
        _id: 1,
        title: 1,
        slug: 1,
        image: 1,
        summary: 1,
        creator: 1,
        ratingCount: { $size: "$mealRatings" },
        averageRating: { $avg: "$mealRatings.rating" }
      }
    }
  ]);

  return mealsData.map(normalizeMeal);
});

const renderStars = (rating: number) => {
  return Array.from({ length: RATING_STARS }, (_, index) => {
    const starValue = index + 1;
    const isActive = starValue <= rating;

    return (
      <Star
        key={starValue}
        size={14}
        className={isActive ? styles.activeStar : styles.inactiveStar}
        fill={isActive ? "currentColor" : "none"}
        strokeWidth={2}
      />
    );
  });
};

export default async function RecipeCard({ meals }: RecipeCardProps = {}) {
  const [transformedMeals, user] = await Promise.all([
    meals ? Promise.resolve(meals.map(normalizeMeal)) : getTopRecipes(),
    getUserFromCookies()
  ]);

  const userId = user?.userId || null;

  const validMealIds = transformedMeals
    .map((meal) => meal.id)
    .filter((id) => mongoose.Types.ObjectId.isValid(id));
  const favoriteIds = new Set(
    userId && validMealIds.length > 0
      ? (await Favorite.find({ userId, mealId: { $in: validMealIds } })
        .select("mealId")
        .lean()).map((favorite) => favorite.mealId.toString())
      : []
  );

  return (
    <>
      {transformedMeals.map((meal) => (
        <div key={meal.id} className={styles.cardContainer}>
          <div className={styles.cardHeader}>
            <div className={styles.categoryTag}>
              <Utensils size={14} /> {meal.title}
            </div>
            <Image
              src={meal.image}
              alt={meal.title}
              width={300}
              height={200}
              className={styles.recipeImage}
            />
          </div>

          <div className={styles.cardBody}>
            <div className={styles.chefRow}>
              <div className={styles.chefInfo}>
                <div className={styles.avatar}>
                  <User size={18} />
                </div>
                <span className={styles.username}>{meal.creator}</span>
              </div>
              <div className={styles.favoriteAction}>
                <FavoriteButton
                  mealId={meal.id}
                  initialIsFavorite={favoriteIds.has(meal.id)}
                  isAuthenticated={Boolean(userId)}
                  compact
                />
              </div>
            </div>

            <h3 className={styles.recipeTitle}>{meal.title}</h3>

            <div className={styles.ratingRow}>
              {userId ? (
                <div className={styles.interactiveStars}>
                  <RatingStars mealId={meal.id} initialRating={meal.averageRating} />
                </div>
              ) : (
                <>
                  <div className={styles.stars}>
                    {renderStars(meal.averageRating)}
                  </div>
                  <span className={styles.ratingText}>({meal.averageRating.toFixed(1)} / 5)</span>
                </>
              )}
            </div>

            <Button
              href={`/meals/${meal.slug}`}
              variant="plain"
              className={styles.seeRecipeBtn}
              iconRight={<ArrowRight size={16} />}
            >
              See Recipe
            </Button>
          </div>
        </div>
      ))}
    </>
  );
}
