export interface AuthUser {
  _id: string;
  email: string;
  name?: string;
}

export interface SavedReservation {
  _id: string;
  userId: string;
  date: string;
  time: string;
  guests: number;
  notes: string | null;
  name?: string;
  email?: string;
}