import Link from "next/link";
import Image from "next/image";
import { cache } from "react";
import connect from "@/lib/db";
import Meal from "@/models/Meal";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import RatingStars from "@/components/meals/rating-stars/RatingStars";
import styles from "./recipe-card.module.css";
import { Star, Heart, ArrowRight, Utensils, User } from "lucide-react";

// High Performance Data Fetching with Aggregation
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
    likes: Math.floor(Math.random() * 100) + 50,
    category: "Recipe"
  }));
});

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        size={14}
        fill={i <= rating ? "var(--lunar-green-600)" : "none"}
        stroke={i <= rating ? "var(--lunar-green-600)" : "var(--neutral-300)"}
        strokeWidth={2}
      />
    );
  }
  return stars;
};

export default async function RecipesCard() {
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
              <Utensils size={14} /> {meal.slug}
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

            <Link href={`/meals/${meal.slug}`} className={styles.seeRecipeBtn}>
              See Recipe <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      ))}
    </>
  );
}
