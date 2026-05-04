"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import { useToast } from "@/context/toast/ToastProvider";
import styles from "./rating-stars.module.css";

const STAR_COUNT = 5;

interface RatingStarsProps {
  mealId: string;
  initialRating: number;
}

export default function RatingStars({ mealId, initialRating }: RatingStarsProps) {
  const { toast } = useToast();
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

        if (response.status === 401) {
          setRating(initialRating);
          return;
        }

        if (!response.ok) {
          throw new Error("Rating could not be loaded.");
        }

        const data = await response.json();
        setRating(data.rating !== undefined ? data.rating : initialRating);
      } catch {
        setError("Rating could not be loaded.");
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
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || "Rating could not be saved.");
      }

      const data = await response.json();
      setRating(newRating);
      setAverageRating(data.averageRating);
      toast.success("Rating saved successfully.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Rating could not be saved.");
      setError("Rating could not be saved.");
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
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
