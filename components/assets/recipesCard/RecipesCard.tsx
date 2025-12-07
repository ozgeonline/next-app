import Link from "next/link";
import Image from "next/image";
import connect from "@/lib/db";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import Meal from "@/app/models/Meal";
import Rating from "@/app/models/Rating";
import RatingStars from "@/components/meals/RatingStars";
import styles from "./recipes.module.css";
import { Star, StarHalf } from "lucide-react";

interface RecipesCardProps {
  spotlight: boolean;
  meals: any[];
}

export default async function RecipesCard({ spotlight, meals }: RecipesCardProps) {
  await connect();

  const user = await getUserFromCookies();
  const userId = user?.userId || null;

  meals = await Meal.find().sort({ createdAt: -1 }).lean();
  //const userLength = await User.countDocuments();

  const transformedMeals = await Promise.all(
    meals.map(async (meal: any) => {
      const ratingCount = await Rating.countDocuments({ mealId: meal._id });
      const ratings = await Rating.find({ mealId: meal._id });
      //console.log('ratings:', ratings);
      const sumRatings = ratings.reduce((sum: number, r: any) => sum + r.rating, 0);
      const computedAverage = ratingCount > 0 ? sumRatings / ratingCount : 0;

      const transformedMeal = {
        id: meal._id.toString(),
        title: meal.title || "Untitled Meal",
        slug: meal.slug || meal._id.toString(),
        image: meal.image && meal.image !== "" ? meal.image : null,
        summary: meal.summary || "No summary available",
        creator: meal.creator || "Unknown",
        averageRating: computedAverage,
        ratingCount,
      };
      //console.log('RecipesCard transformedMeal:', transformedMeal);
      return transformedMeal;
    })
  );

  const renderStars = (averageRating: number) => {
    const stars = [];
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} fill="#111" strokeWidth={1} stroke="#111" />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" fill="#111" strokeWidth={1} stroke="#111" />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<Star key={i} strokeWidth={1} stroke="#111" />);
    }
    return stars;
  };

  return (
    <>
      {transformedMeals.slice(0, 5).map((meal) => (
        <div key={meal.id} className={styles.container}>
          <div className={styles.card}>
            <div className={styles["recipe-card"]}>
              <div className={spotlight ? styles["spotlight-image"] : styles["recipe-image"]}>
                <Image
                  src={meal.image}
                  alt="recipes-card"
                  width={0}
                  height={0}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={styles["image-inner"]}
                />
                {!spotlight && (
                  <Link className={styles["recipe-link"]} href={`/meals/${meal.slug}`}>
                    View Details
                  </Link>
                )}
              </div>

              {spotlight && (
                <div className={styles["recipe-overlay"]}>
                  <div className={styles["spotlight-info"]}>
                    <h3>{meal.title}</h3>
                    <p>
                      by <span>{meal.creator}</span>
                    </p>
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
                      className={styles["spotlight-button"] + " " + "text-gold-on-dark"}
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