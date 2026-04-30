"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import styles from "./rating-stars.module.css";

const STAR_COUNT = 5;

interface RatingStarsProps {
  mealId: string;
  initialRating: number;
}

export default function RatingStars({ mealId, initialRating }: RatingStarsProps) {
  const [rating, setRating] = useState<number>(initialRating);
  const [averageRating, setAverageRating] = useState<number>(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAverageRating(initialRating);
  }, [initialRating]);

  useEffect(() => {
    async function fetchUserRating() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/meals/ratings/${mealId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
        }

        const data = await response.json();
        setRating(data.rating !== undefined ? data.rating : initialRating);
      } catch (err: unknown) {
        setError(`Failed to load rating: ${err instanceof Error ? err.message : String(err)}`);
        setRating(initialRating);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserRating();
  }, [mealId, initialRating]);

  const submitRating = async (newRating: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/meals/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ mealId, rating: newRating }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      setRating(newRating);
      setAverageRating(data.averageRating);
    } catch (err: unknown) {
      setError(`Failed to submit rating: ${err instanceof Error ? err.message : String(err)}`);
      setRating(initialRating);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className={styles.stars}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.starContainer}>
        <div className={styles.starWrapper}>
          {Array.from({ length: STAR_COUNT }, (_, index) => {
            const starValue = index + 1;
            const displayRating = hoverRating || rating;
            const isActive = starValue <= Math.round(displayRating);

            return (
              <Button
                key={index}
                type="button"
                variant="plain"
                className={styles.starButton}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => submitRating(starValue)}
                aria-label={`Rate ${starValue} out of ${STAR_COUNT}`}
              >
                <Star
                  className={styles.star}
                  fill={isActive ? "currentColor" : "none"}
                  strokeWidth={isActive ? 0 : 1}
                />
              </Button>
            );
          })}
        </div>
        <span className={styles.rating}>
          ({averageRating.toFixed(1)} / 5)
        </span>
      </div>
      {error && <span className={styles.error}>something went wrong, try again</span>}
    </div>
  );
}
