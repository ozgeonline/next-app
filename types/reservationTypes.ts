import type { ClientUser } from "@/types/userTypes";

export interface SavedReservation {
  _id?: string;
  userId?: ClientUser;
  date: string;
  time: string;
  guests: number;
  notes: string | null;
  status?: "active" | "cancelled";
  editCount?: number;
  cancelledAt?: string | Date | null;
  createdAt?: string;
  updatedAt?: string;
}
