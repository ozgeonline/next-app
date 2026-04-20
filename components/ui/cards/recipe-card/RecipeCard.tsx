// Recipe Card component: Presents individual meal data (image, title, summary) with interactive routing to details.
import Link from "next/link";
import Image from "next/image";
import { cache } from "react";
import connect from "@/lib/db";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import Meal from "@/models/Meal";
import RatingStars from "@/components/meals/rating-stars/RatingStars";
import styles from "./recipe-card.module.css";
import { Star, StarHalf } from "lucide-react";

interface RecipesCardProps {
  spotlight: boolean;
}

// High Performance Data Fetching with Aggregation (for N+1 problem)
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
    image: meal.image || null,
    summary: meal.summary || "No summary available",
    creator: meal.creator || "Unknown",
    averageRating: meal.averageRating || 0,
    ratingCount: meal.ratingCount || 0,
  }));
});

// Star Rating Generator
const renderStars = (averageRating: number) => {
  const stars = [];
  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={`full-${i}`} fill="var(--neutral-950)" strokeWidth={1} stroke="var(--neutral-950)" />);
  }

  if (hasHalfStar) {
    stars.push(<StarHalf key="half" fill="var(--neutral-950)" strokeWidth={1} stroke="var(--neutral-950)" />);
  }

  for (let i = stars.length; i < 5; i++) {
    stars.push(<Star key={`empty-${i}`} strokeWidth={1} stroke="var(--neutral-950)" />);
  }

  return stars;
};

export default async function RecipesCard({ spotlight }: RecipesCardProps) {
  const [transformedMeals, user] = await Promise.all([
    getTopRecipes(),
    getUserFromCookies()
  ]);

  const userId = user?.userId || null;

  return (
    <>
      {transformedMeals.map((meal) => (
        <div key={meal.id} className={styles.container}>
          <div className={styles.card}>
            <div className={styles["recipe-card"]}>
              <div className={spotlight ? styles["cardDetailed-image"] : styles["cardCompact-image"]}>
                <Image
                  src={meal.image || "/logo.png"}
                  alt={meal.title}
                  width={100}
                  height={100}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={90}
                  priority={spotlight}
                  className={styles["image-inner"]}
                  style={{ objectFit: 'cover' }}
                />
                {!spotlight && (
                  <Link className={styles["cardCompact-link"]} href={`/meals/${meal.slug}`}>
                    View Details
                  </Link>
                )}
              </div>

              {spotlight && (
                <div className={styles["cardDetailed-overlay"]}>
                  <div className={styles["cardDetailed-info"]}>
                    <h3>{meal.title}</h3>
                    <p>by <span>{meal.creator}</span></p>

                    <div className={styles.stars}>
                      {userId ? (
                        <RatingStars mealId={meal.id} initialRating={meal.averageRating} />
                      ) : (
                        <div className={styles.ratingCountWrapper}>
                          {renderStars(meal.averageRating)}
                          <span className={styles.ratingCount}>
                            ({meal.ratingCount} {meal.ratingCount === 1 ? "rating" : "ratings"})
                          </span>
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/meals/${meal.slug}`}
                      className="accent-link-button"
                    >
                      See Recipe
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
