"use client";

import useSWR from "swr";
import { useAuth } from "@/context/auth/AuthProvider";
import { SavedReservation } from "@/types/reservationTypes";

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
    // Hata durumunda da json parse hatasini yakalamak icin try/catch benzeri yaklasim
    const data = await res.json().catch(() => ({})); 
    throw new Error(data.error || "Failed to fetch reservations");
  }

  const data = await res.json();

  return data.reservations.map((reservation: any) => ({
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

  // Yalnızca kullanıcı doğrulama işlemi bittiyse ve kullanıcı giriş yaptıysa istek at (Conditional Fetching)
  const shouldFetch = !authLoading && isAuthenticated && user;

  const { data, error, isLoading, mutate } = useSWR<SavedReservation[]>(
    shouldFetch ? "/api/reservations" : null,
    fetcher
  );

  return {
    reservations: data || [],
    // Eğer auth işlemi sürüyorsa veya api isteği sürüyorsa sistemi loading say
    loading: authLoading || isLoading, 
    error: error ? error.message : null,
    refetchReservations: async () => {
      await mutate();
    },
  };
};