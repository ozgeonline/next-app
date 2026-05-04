import type { SavedReservation } from "@/types/reservationTypes";

export const MAX_RESERVATION_EDITS = 2;
export const RESERVATION_EDIT_CUTOFF_HOURS = 2;

export type ReservationStatus = "active" | "cancelled";

export function getReservationDateTime(date: string | Date, time: string) {
  const dateOnly = new Date(date).toISOString().split("T")[0];
  return new Date(`${dateOnly}T${time}:00`);
}

export function isPastReservation(date: string | Date, time: string) {
  return getReservationDateTime(date, time).getTime() < Date.now();
}

export function isReservationInsideEditCutoff(date: string | Date, time: string) {
  const reservationTime = getReservationDateTime(date, time).getTime();
  const cutoffMs = RESERVATION_EDIT_CUTOFF_HOURS * 60 * 60 * 1000;
  return reservationTime - Date.now() < cutoffMs;
}

export function canEditReservation(reservation: Pick<SavedReservation, "date" | "time" | "status" | "editCount">) {
  if (reservation.status === "cancelled") return false;
  if (isPastReservation(reservation.date, reservation.time)) return false;
  if ((reservation.editCount || 0) >= MAX_RESERVATION_EDITS) return false;
  return !isReservationInsideEditCutoff(reservation.date, reservation.time);
}
