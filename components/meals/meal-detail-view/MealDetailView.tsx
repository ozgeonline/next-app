"use client";

import { useCallback, useState } from "react";
import { ChefHat, Info, MessageCircle } from "lucide-react";
import FavoriteButton from "@/components/favorites/favorite-button/FavoriteButton";
import MealComments from "@/components/comments/meal-comments/MealComments";
import { Button } from "@/components/ui/button/Button";
import styles from "./meal-detail-view.module.css";

type MealDetailViewProps = {
  mealId: string;
  title: string;
  creator: string;
  summary: string;
  instructions: string;
  initialIsFavorite: boolean;
  isAuthenticated: boolean;
  isMealCreator: boolean;
  initialCommentCount: number;
};

export default function MealDetailView({
  mealId,
  title,
  creator,
  summary,
  instructions,
  initialIsFavorite,
  isAuthenticated,
  isMealCreator,
  initialCommentCount,
}: MealDetailViewProps) {
  const [activeView, setActiveView] = useState<"recipe" | "comments">("recipe");
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const instructionLines = instructions.split("\n").filter((line) => line.trim());

  const handleCommentCountChange = useCallback((count: number) => {
    setCommentCount(count);
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.actionGroup}>
            <FavoriteButton
              mealId={mealId}
              initialIsFavorite={initialIsFavorite}
              isAuthenticated={isAuthenticated}
            />
            <Button
              type="button"
              variant="plain"
              className={`${styles.commentToggle} ${activeView === "comments" ? styles.activeCommentToggle : ""}`}
              onClick={() => setActiveView("comments")}
              aria-label="Show comments"
            >
              <MessageCircle size={18} />
              <span>{commentCount}</span>
            </Button>
          </div>
        </div>

        <p className={styles.creator}>
          <ChefHat size={18} className={styles.creatorIcon} /> Recipe by <span>{creator}</span>
        </p>

        {activeView === "recipe" && <p className={styles.summary}>{summary}</p>}
      </header>

      {activeView === "recipe" ? (
        <section className={styles.instructionsSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.iconCircle}>
              <Info size={18} />
            </div>
            <h2>Instructions</h2>
          </div>
          <ul className={styles.instructionsList}>
            {instructionLines.map((line, index) => (
              <li key={`${index}-${line}`}>
                <span className={styles.stepNumber}>{index + 1}</span>
                <p>{line.trim()}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <MealComments
          mealId={mealId}
          isAuthenticated={isAuthenticated}
          isMealCreator={isMealCreator}
          onBackToRecipe={() => setActiveView("recipe")}
          onCommentCountChange={handleCommentCountChange}
        />
      )}
    </>
  );
}
