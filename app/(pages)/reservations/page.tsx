"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth/AuthProvider";
import { useReservations } from "@/hooks/useReservation";
import { cleanupExpiredReservations } from "@/utils/reservations/cleanupExpiredReservations";
import { SavedReservation } from "@/types/reservationTypes";
import styles from "./reservation.module.css";

export default function ReservationPage() {
  const { user } = useAuth();
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
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [expiredMessage, setExpiredMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  //console.log("user from AuthProvider:", user);
  // console.log("editReservationId", editReservationId);
  //console.log("reservation", reservation);

  const showMessage = (type: "error" | "success", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
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

  const validateInputs = () => {
    const parsedDate = new Date(reservation.date);

    if (isNaN(parsedDate.getTime()) || !reservation.time || reservation.guests < 1) {
      showMessage("error", "Please provide a valid date, time, and number of guests.");
      return false;
    }
    return true;
  };

  //if a reservation is made today, check if the selected time is in the future
  const checkDateConstraints = () => {
    const parsedDate = new Date(reservation.date);
    const parsedDay = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());

    const today = new Date();
    const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const isToday = parsedDay.toDateString() === todayDay.toDateString();

    if (parsedDay < todayDay && !isToday) {
      showMessage("error", "You cannot make a reservation for a past date.");
      return false;
    }

    if (isToday) {
      const [hours, minutes] = reservation.time.split(":").map(Number);

      const now = new Date();
      now.setSeconds(0, 0);

      const selected = new Date();
      selected.setHours(hours, minutes, 0, 0);
      
      if (selected <= now) {
        showMessage("error", "You cannot select a past time for today.");
        return false;
      }
    }

    return true;
  };

  // check reservation limit
  const checkReservationLimit = () => {
  if (!editReservationId && reservations.length > 0) {
    showMessage("error", "You can only have one active reservation.");
    return false;
  }
  return true;
};

  const buildRequestData = () => {
    const payload = {
      date: new Date(reservation.date).toISOString(),
      time: reservation.time,
      guests: reservation.guests,
      notes: reservation.notes,
    };

    const url = editReservationId
      ? `/api/auth/reservations/${editReservationId}`
      : `/api/auth/reservations`;

    const method = editReservationId ? "PUT" : "POST";

    // console.log("method", method);
    return { url, method, payload };
  };

  const resetForm = () => {
    setReservation({ date: "", time: "", guests: 1, notes: "" });
    setEditReservationId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      
    if (!validateInputs()) return;
    if (!checkDateConstraints()) return;
    if (!checkReservationLimit()) return;

    try {
      setIsSubmitting(true);
      setMessage(null);

      const { url, method, payload } = buildRequestData();

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Failed to ${editReservationId ? "update" : "save"} reservation`);

      await refetchReservations();
      showMessage("success", `Reservation ${editReservationId ? "updated" : "created"} successfully.`);
      resetForm();

      //console.log("Reservation req:", { url, method, editReservationId, body: payload });
    } catch (err: any) {
      showMessage("error", err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/auth/reservations/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete reservation");

      resetForm();
      
      await refetchReservations();

      showMessage("success", "Reservation deleted successfully.");
    } catch (err: any) {
      showMessage("error", err.message || "Something went wrong.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const cleanup = async () => {
      await cleanupExpiredReservations(refetchReservations, ( text) => {
        setExpiredMessage(text);
      });
    };

    cleanup();
  }, []);


  return (
    <>
      <div className={styles.containerWrapper + ' ' + "mainBackground"}>
        <div className={styles.containerTopNavbar} />
        <div className={styles.formSection}>
          <h2>{editReservationId ? "Update Reservation" : "Make a Reservation"}</h2>

          {/* error-success info */}
          {message && (
            <p className={message.type === "error" ? styles.error : styles.success}>
              {message.text}
            </p>
          )}

          {reservationsError && <p className={styles.error}>{reservationsError}</p>}

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
          {reservationsLoading ? (
            <div>Loading...</div>
          ) : reservations.length > 0 ? (
            reservations.map((res) => (
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
                <button
                  type="button"
                  className={styles.button}
                  onClick={() => handleDelete(res._id || "")}
                >
                  {isDeleting ? "Deleting..." : "Delete Reservation"}
                </button>
              </div>
            ))
          ) : (
           !reservationsLoading && reservations.length === 0 && 
            <p>No reservations found.</p> 
          )}

          {expiredMessage && (
            <div>{expiredMessage}</div>
          )}
        </div>
      </div>
    </>
  );
}