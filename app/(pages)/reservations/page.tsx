"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth/AuthProvider";
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

//   const createReservation = async () => {
//   try {
//     const res = await fetch("/api/auth/reservations", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         date: "2025-09-01",
//         time: "19:00",
//         guests: 4,
//         notes: "Pencere kenarı masa lütfen",
//       }),
//     });

//     const data = await res.json();
//     console.log("Response:", data);
//   } catch (err) {
//     console.error("Error creating reservation:", err);
//   }
// };


  const [reservation, setReservation] = useState<SavedReservation>({
    date: "",
    time: "",
    guests: 1,
    notes: "",
  });
  const [editReservationId, setEditReservationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  //console.log("user from AuthProvider:", user);
  // console.log("editReservationId", editReservationId);
  //console.log("reservation", reservation);

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

  // Update reservation
  const handleEdit = (res: SavedReservation) => {
    setReservation({
      _id: res._id || "",
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
    if (name !== "name" && name !== "email") { //readonly
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

    //if a reservation is made today, check if the selected time is in the future
    if (parsedDay.getTime() === todayDay.getTime()) {
      const [hours, minutes] = reservation.time.split(":").map(Number);

      const selectedTime = new Date();
      selectedTime.setHours(hours, minutes, 0, 0);

      const nowTime = new Date();
      nowTime.setSeconds(0, 0);

      if (selectedTime <= nowTime) {
        showError("You cannot select a past time for today.");
        return;
      }

      // console.log("---- TEST ----");
      // console.log("selectedTime:", selectedTime.toString());
      // console.log("nowTime     :", nowTime.toString());
      // console.log("selected <= now ?", selectedTime <= nowTime);
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
        : "/api/auth/reservations";

      const method = editReservationId ? "PUT" : "POST";
      // console.log("method", method);

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      // check json body
      let data = null;
      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      await refetchReservations();

      if (!res.ok) {
        throw new Error(
          data?.error || `Failed to ${editReservationId ? "update" : "save"} reservation`
        );
      }

      showSuccess(`Reservation ${editReservationId ? "updated" : "saved"} successfully!`);
      setReservation({
        _id: "",
        date: "",
        time: "",
        guests: 1,
        notes: "",
      });
      setEditReservationId(null);

      //console.log("Reservation req:", { url, method, editReservationId, body: payload });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading && reservationsLoading) return <div className={styles.loading}>Loading...</div>;

  return (
    <>
      <div className={styles.containerWrapper + ' ' + "mainBackground"}>
        <div className={styles.containerTopNavbar} />
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
                value={user?.name || ""}
                className={`${styles.input}`}
                readOnly
              />
            </label>

            <label>
              Email:
              <input
                type="email"
                name="email"
                value={user?.email || ""}
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
              // console.log("res", res),
              <div key={res._id || `${res.date}-${res.time}`} className={styles.reservationCard}>
                <p><strong>Name:</strong> {user?.name || "N/A"}</p>
                <p><strong>Email:</strong> {user?.email || "N/A"}</p>
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
    </>
  );
}