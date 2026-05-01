"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button/Button";
import styles from "./favorite-button.module.css";
import { Heart } from "lucide-react";

type FavoriteButtonProps = {
  mealId: string;
  initialIsFavorite?: boolean;
  isAuthenticated?: boolean;
  compact?: boolean;
  onChange?: (isFavorite: boolean) => void;
};

export default function FavoriteButton({
  mealId,
  initialIsFavorite = false,
  isAuthenticated = false,
  compact = false,
  onChange,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthenticated) {
    return (
      <Button
        href="/login"
        variant="plain"
        className={`${styles.favoriteButton} ${compact ? styles.compact : ""}`}
        aria-label="Log in to save meal"
      >
        <Heart size={compact ? 16 : 18} />
      </Button>
    );
  }

  const handleToggle = async () => {
    if (isLoading) return;

    const previousValue = isFavorite;
    setIsFavorite((current) => !current);
    setIsLoading(true);

    try {
      const response = await fetch("/api/meals/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mealId }),
      });

      if (!response.ok) {
        setIsFavorite(previousValue);
        return;
      }

      const data = await response.json();
      const nextValue = Boolean(data.isFavorite);
      setIsFavorite(nextValue);
      onChange?.(nextValue);
    } catch {
      setIsFavorite(previousValue);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="plain"
      className={`${styles.favoriteButton} ${isFavorite ? styles.active : ""} ${compact ? styles.compact : ""}`}
      onClick={handleToggle}
      disabled={isLoading}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart size={compact ? 16 : 18} fill={isFavorite ? "currentColor" : "none"} />
    </Button>
  );
}
