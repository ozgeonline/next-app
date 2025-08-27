"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/auth/AuthProvider";
import { useReservations } from "@/hooks/useReservation";
import { SavedReservation } from "@/types/reservationTypes";
import styles from "./reservation.module.css";

export default function ReservationPage() {
  const { user, loading: authLoading } = useAuth();
  const {
    reservations,
    loading: reservationsLoading,
    error: reservationsError,
    refetchReservations,
  } = useReservations();

  const [reservation, setReservation] = useState<SavedReservation>({
    userId: "",
    name: "",
    email: "",
    date: "",
    time: "",
    guests: 1,
    notes: "",
  });
  const [editReservationId, setEditReservationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  // pre-fill
  useEffect(() => {
    if (user && !authLoading) {
      setReservation((prev) => ({
        ...prev,
        userId: user._id,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user, authLoading]);

  // Update reservation
  const handleEdit = (res: SavedReservation) => {
    setReservation({
      userId: user?._id || "",
      name: user?.name || "",
      email: user?.email || "",
      date: new Date(res.date).toISOString().split("T")[0],
      time: res.time,
      guests: res.guests,
      notes: res.notes || "",
    });
    setEditReservationId(res._id || null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name !== "name" && name !== "email") {
      setReservation((prev) => ({
        ...prev,
        [name]: name === "guests" ? parseInt(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //validate input 
    const parsedDate = new Date(reservation.date);
    const parsedDay = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());

    const today = new Date();
    const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (isNaN(parsedDate.getTime()) || !reservation.time || reservation.guests < 1) {
      setError("Please provide a valid date, time, and number of guests.");
      return;
    }

    if (parsedDay.getTime() === todayDay.getTime()) {
      const [hours, minutes] = reservation.time.split(":").map(Number);

      const selectedTime = new Date();
      selectedTime.setHours(hours, minutes, 0, 0);

      const nowTime = new Date();
      nowTime.setSeconds(0, 0);

      // console.log("---- TEST ----");
      // console.log("selectedTime:", selectedTime.toString());
      // console.log("nowTime     :", nowTime.toString());
      // console.log("selected <= now ?", selectedTime <= nowTime);

      if (selectedTime <= nowTime) {
        showError("You cannot select a past time for today.");
        return;
      }
    }

    if (parsedDay < todayDay) {
      showError("You cannot make a reservation for a past date.");
      return;
    }

    // check reservation limit
    if (!editReservationId && reservations.length > 0) {
      showError("You can only have one active reservation.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      const payload = {
        date: new Date(reservation.date).toISOString(),
        time: reservation.time,
        guests: reservation.guests,
        notes: reservation.notes,
      };

      const url = editReservationId
        ? `/api/auth/reservations/${editReservationId}`
        : "/api/auth/reservation";
      const method = editReservationId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      // check json body
      const contentType = res.headers.get("content-type");
      let data = null;

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (!res.ok) {
        throw new Error(
          data?.error || `Failed to ${editReservationId ? "update" : "save"} reservation`
        );
      }

      await refetchReservations();
      
      showSuccess(`Reservation ${editReservationId ? "updated" : "saved"} successfully!`);
      setReservation({
        userId: user?._id || "",
        name: user?.name || "",
        email: user?.email || "",
        date: "",
        time: "",
        guests: 1,
        notes: "",
      });
      setEditReservationId(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading && reservationsLoading) return <div className={styles.loading}>Loading...</div>;
  // if (!isAuthenticated) {
  //   router.push("/login");
  //   return null;
  // }

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.formSection}>
        
        <h2>{editReservationId ? "Update Reservation" : "Make a Reservation"}</h2>

        {/* error-success info */}
        {error && <p className={styles.error}>{error}</p>}
        {reservationsError && <p className={styles.error}>{reservationsError}</p>}
        {success && <p className={styles.success}>{success}</p>}

        {/* reservation - form area */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={reservation.name}
              className={`${styles.input}`}
              readOnly
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              name="email"
              value={reservation.email}
              className={`${styles.input}`}
              readOnly
            />
          </label>

          <label>
            Date:
            <input
              type="date"
              name="date"
              value={reservation.date}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </label>

          <label>
            Time:
            <input
              type="time"
              name="time"
              value={reservation.time}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </label>

          <label>
            Number of Guests:
            <input
              type="number"
              name="guests"
              min="1"
              max="20"
              value={reservation.guests}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </label>

          <label>
            Special Notes:
            <textarea
              name="notes"
              value={reservation.notes || ""}
              placeholder="Enter any special notes"
              onChange={handleChange}
              className={styles.textarea}
            />
          </label>

          <button type="submit" className={styles.button} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : editReservationId ? "Save Changes" : "Reserve"}
          </button>
        </form>
      </div>

      <div className={styles.infoSection}>
        <h2>Your Reservations</h2>
        {reservations.length > 0 ? (
          reservations.map((res) => (
            <div key={res._id || `${res.date}-${res.time}`} className={styles.reservationCard}>
              <p><strong>Name:</strong> {res.name || "N/A"}</p>
              <p><strong>Email:</strong> {res.email || "N/A"}</p>
              <p><strong>Date:</strong> {new Date(res.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {res.time}</p>
              <p><strong>Guests:</strong> {res.guests}</p>
              <p><strong>Notes:</strong> {res.notes || "-"}</p>
              <button
                onClick={() => handleEdit(res)}
                className={styles.button}
                disabled={editReservationId === res._id}
              >
                Update
              </button>
            </div>
          ))
        ) : (
          <p>No reservations found.</p>
        )}
      </div>
    </div>
  );
}