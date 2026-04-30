"use client";

import { useCallback } from "react";
import useSWR from "swr";
import { useAuth } from "@/context/auth/AuthProvider";
import { SavedReservation } from "@/types/reservationTypes";

type ReservationResponseItem = {
  _id?: string;
  userId?: SavedReservation["userId"];
  date: string;
  time: string;
  guests: number;
  notes?: string | null;
};

interface ReservationState {
  reservations: SavedReservation[];
  loading: boolean;
  error: string | null;
  refetchReservations: () => Promise<void>;
}

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to fetch reservations");
  }

  const data = await res.json();

  return data.reservations.map((reservation: ReservationResponseItem) => ({
    _id: reservation._id,
    userId: reservation.userId,
    date: reservation.date,
    time: reservation.time,
    guests: reservation.guests,
    notes: reservation.notes || null,
  })) as SavedReservation[];
};

export const useReservations = (): ReservationState => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Conditional Fetching
  const shouldFetch = !authLoading && isAuthenticated && user;

  const { data, error, isLoading, mutate } = useSWR<SavedReservation[]>(
    shouldFetch ? "/api/reservations" : null,
    fetcher
  );

  const refetchReservations = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return {
    reservations: data || [],
    loading: authLoading || isLoading,
    error: error ? error.message : null,
    refetchReservations,
  };
};
