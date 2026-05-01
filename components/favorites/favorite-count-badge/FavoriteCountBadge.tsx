"use client";

import useSWR from "swr";
import styles from "./favorite-count-badge.module.css";

type FavoriteMealsResponse = {
  meals: Array<{ id: string }>;
};

const fetcher = async (url: string): Promise<FavoriteMealsResponse> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch favorite count");
  return response.json();
};

export default function FavoriteCountBadge() {
  const { data } = useSWR<FavoriteMealsResponse>("/api/meals/favorites", fetcher);
  const count = data?.meals.length ?? 0;

  return <span className={styles.badge}>{count}</span>;
}
