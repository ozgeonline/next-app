"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth/AuthProvider";
import { useReservations } from "@/hooks/useReservation";
import { cleanupExpiredReservations } from "@/utils/reservations/cleanupExpiredReservations";
import { SavedReservation } from "@/types/reservationTypes";
import WavesBackground from "@/components/ui/backgrounds/wavesBackground/WavesBackground";
import styles from "./reservation.module.css";
import Link from "next/link";
import {
  User,
  Mail,
  Calendar,
  Clock,
  Users,
  FileText,
  ArrowRight,
  Leaf,
  Trash2,
  Edit3
} from "lucide-react";

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
  //     const res = await fetch("/api/reservations", {
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
    setTimeout(() => setMessage(null), 4000);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      ? `/api/reservations/${editReservationId}`
      : `/api/reservations`;

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
    if (!validateInputs() || !checkDateConstraints() || !checkReservationLimit()) return;

    try {
      setIsSubmitting(true);
      const { url, method, payload } = buildRequestData();
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save reservation");

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
    if (!confirm("Are you sure you want to delete this reservation?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/reservations/${id}`, {
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
    cleanupExpiredReservations(refetchReservations, (text) => setExpiredMessage(text));
  }, []);

  const getInfoItems = (res: SavedReservation, userObj: any) => [
    { label: "Name", value: userObj?.name || "N/A", icon: <User size={18} /> },
    { label: "Email", value: userObj?.email || "N/A", icon: <Mail size={18} /> },
    { label: "Date", value: new Date(res.date).toLocaleDateString(), icon: <Calendar size={18} /> },
    { label: "Time", value: res.time, icon: <Clock size={18} /> },
    { label: "Guests", value: res.guests, icon: <Users size={18} /> },
    { label: "Notes", value: res.notes || "-", icon: <FileText size={18} /> },
  ];

  if (authLoading) return null;

  return (
    <div className={styles.pageWrapper}>
      <WavesBackground />
      <div className="containerTopNavbarColor" />

      <div className={styles.mainContainer}>
        {!user ? (
          <div className={styles.authMessage}>
            <h2>Start Your Experience</h2>
            <p>You must be logged in to make a reservation.</p>
            <Link href="/login" className={styles.loginBtn}>Login Now</Link>
          </div>
        ) : (
          <>
            {/* FORM CARD */}
            <div className={styles.formCard}>
              <div className={styles.cardHeader}>
                <div className={styles.titleWrapper}>
                  <h2 className={styles.titleSmall}>Make a</h2>
                  <h1 className={styles.titleLarge}>
                    Reservation <Leaf className={styles.headerLeaf} />
                  </h1>
                </div>
              </div>

              <form onSubmit={handleSubmit} className={styles.reservationForm}>
                <div className={styles.inputGroup}>
                  <label>Name</label>
                  <div className={styles.inputWrapper}>
                    <User className={styles.inputIcon} size={20} />
                    <input type="text" value={user.name} readOnly className={styles.readOnlyInput} />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Email</label>
                  <div className={styles.inputWrapper}>
                    <Mail className={styles.inputIcon} size={20} />
                    <input type="email" value={user.email} readOnly className={styles.readOnlyInput} />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.inputGroup}>
                    <label>Date</label>
                    <div className={styles.inputWrapper}>
                      <Calendar className={styles.inputIcon} size={20} />
                      <input
                        type="date"
                        name="date"
                        value={reservation.date}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Time</label>
                    <div className={styles.inputWrapper}>
                      <Clock className={styles.inputIcon} size={20} />
                      <input
                        type="time"
                        name="time"
                        value={reservation.time}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Number of Guests</label>
                  <div className={styles.inputWrapper}>
                    <Users className={styles.inputIcon} size={20} />
                    <select name="guests" value={reservation.guests} onChange={handleChange}>
                      {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>Special Notes</label>
                  <div className={styles.inputWrapper}>
                    <Edit3 className={styles.inputIcon} size={20} />
                    <textarea
                      name="notes"
                      value={reservation.notes || ""}
                      onChange={handleChange}
                      placeholder="Add any requests..."
                    />
                  </div>
                </div>

                {message && (
                  <div className={`${styles.statusMessage} ${styles[message.type]}`}>
                    {message.text}
                  </div>
                )}

                <button type="submit" className={styles.reserveBtn} disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : editReservationId ? "Update Reservation" : "Reserve"}
                  <ArrowRight size={20} />
                </button>
              </form>
            </div>

            {/* SUMMARY CARD */}
            <div className={styles.summarySection}>
              <div className={styles.summaryCard}>
                <div className={styles.summaryHeader}>
                  <h2 className={styles.summaryTitle}>
                    Your <span className={styles.highlight}>Reservation</span>
                  </h2>
                  <div className={styles.headerIcon}>
                    <Calendar size={24} />
                  </div>
                </div>

                <div className={styles.detailsList}>
                  {reservations.length > 0 ? (
                    reservations.map((res) => (
                      <div key={res._id} className={styles.detailsContainer}>
                        {getInfoItems(res, user).map((item, idx) => (
                          <div key={idx} className={styles.detailItem}>
                            <div className={styles.detailLabel}>
                              {item.icon}
                              <span>{item.label}</span>
                            </div>
                            <div className={styles.detailValue}>{item.value}</div>
                          </div>
                        ))}

                        <div className={styles.actionButtons}>
                          <button
                            className={styles.editBtn}
                            onClick={() => handleEdit(res)}
                            disabled={editReservationId === res._id}
                          >
                            <Edit3 size={22} /> Update Reservation
                          </button>
                          <button
                            className={styles.deleteBtn}
                            onClick={() => handleDelete(res._id || "")}
                          >
                            <Trash2 size={22} /> Delete Reservation
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.emptyState}>
                      <p>No active reservations found.</p>
                      {expiredMessage && <p className={styles.expiredInfo}>{expiredMessage}</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}