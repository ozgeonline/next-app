"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import styles from "./rating.module.css";

interface RatingStarsProps {
  mealId: any;
  initialRating: number;
}

export default function RatingStars({ mealId, initialRating }: RatingStarsProps) {
  const [rating, setRating] = useState<number>(initialRating);
  const [averageRating, setAverageRating] = useState<number>(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //console.log('RatingStars props:', { mealId, initialRating });

  //update
  useEffect(() => {
    //console.log('initialRating updated:', initialRating);
    setAverageRating(initialRating);
  }, [initialRating]);

  //user's rating
  useEffect(() => {
    async function fetchUserRating() {
      try {
        setIsLoading(true);
        setError(null);
        //console.log('Fetching rating for mealId:', mealId, 'initialRating:', initialRating);
        const response = await fetch(`/api/meals/ratings/${mealId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
        }

        const data = await response.json();
        //console.log('API response:', data.rating, data.userName);
        setRating(data.rating !== undefined ? data.rating : initialRating);
      } catch (err: any) {
        //console.error('Error fetching user rating:', err.message);
        setError(`Failed to load rating: ${err.message}`);
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
      //console.log('Submitting rating:', { mealId, rating: newRating });
      const response = await fetch('/api/meals/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ mealId, rating: newRating }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      //console.log('Rating submission response:', data);
      setRating(newRating);
      setAverageRating(data.averageRating);
    } catch (err: any) {
      //console.error('Error submitting rating:', err.message);
      setError(`Failed to submit rating: ${err.message}`);
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
          {Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1;
            const displayRating = hoverRating || rating;
            return (
              <Star
                key={index}
                className={styles.star}
                fill={starValue <= Math.round(displayRating) ? '#111' : 'none'}
                strokeWidth={starValue <= Math.round(displayRating) ? 0 : 1}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => submitRating(starValue)}
                style={{ cursor: 'pointer' }}
              />
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