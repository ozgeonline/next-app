import Image from "next/image";
import { cache } from "react";
import connect from "@/lib/db";
import Meal from "@/models/Meal";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import RatingStars from "@/components/meals/rating-stars/RatingStars";
import { Button } from "@/components/ui/button/Button";
import styles from "./recipe-card.module.css";
import { Star, Heart, ArrowRight, Utensils, User } from "lucide-react";

const RATING_STARS = 5;

function createStableLikeCount(id: string) {
  const hash = [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return 50 + (hash % 100);
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

  return mealsData.map(meal => ({
    id: meal._id.toString(),
    title: meal.title || "Untitled Meal",
    slug: meal.slug || meal._id.toString(),
    image: meal.image || "/logo.png",
    summary: meal.summary || "No summary available",
    creator: meal.creator || "Unknown",
    averageRating: meal.averageRating || 0,
    ratingCount: meal.ratingCount || 0,
    likes: createStableLikeCount(meal._id.toString()),
    category: "Recipe"
  }));
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

export default async function RecipeCard() {
  const [transformedMeals, user] = await Promise.all([
    getTopRecipes(),
    getUserFromCookies()
  ]);

  const userId = user?.userId || null;

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
              <div className={styles.likes}>
                <Heart size={16} className={styles.heartIcon} />
                <span>{meal.likes}</span>
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
