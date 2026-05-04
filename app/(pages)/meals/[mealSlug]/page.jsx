import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import MealDetailView from "@/components/meals/meal-detail-view/MealDetailView";
import Favorite from "@/models/Favorite";
import Comment from "@/models/Comment";
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
  const isMealCreator = meal.creatorId
    ? meal.creatorId.toString() === userId
    : Boolean(user?.email && meal.creator_email === user.email);
  const favorite = userId
    ? await Favorite.findOne({ mealId, userId }).select("_id").lean()
    : null;
  const commentCount = await Comment.countDocuments({ mealId, status: "visible" });

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
          <MealDetailView
            mealId={mealId}
            title={meal.title}
            creator={meal.creator}
            summary={meal.summary}
            instructions={meal.instructions}
            initialIsFavorite={Boolean(favorite)}
            isAuthenticated={Boolean(userId)}
            isMealCreator={isMealCreator}
            initialCommentCount={commentCount}
          />
        </main>

      </div>
    </div>
  );
}
