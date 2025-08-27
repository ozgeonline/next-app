"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/providers/auth/AuthProvider";
import { SavedReservation } from "@/types/reservationTypes";

interface ReservationState {
  reservations: SavedReservation[];
  loading: boolean;
  error: string | null;
  refetchReservations: () => Promise<void>;
}

export const useReservations = (): ReservationState => {
  const { user, isAuthenticated } = useAuth();
  const [reservations, setReservations] = useState<SavedReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setReservations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/auth/reservations", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch reservations");
      }

      const data = await res.json();
      const fetchedReservations: SavedReservation[] = data.reservations.map(
        (reservation: any) => ({
          _id: reservation._id,
          userId: reservation.userId._id,
          date: reservation.date,
          time: reservation.time,
          guests: reservation.guests,
          notes: reservation.notes || null,
          name: reservation.userId.name,
          email: reservation.userId.email,
        })
      );

      setReservations(fetchedReservations);
    } catch (err: any) {
      setError(err.message);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  return { reservations, loading, error, refetchReservations: fetchReservations };
};