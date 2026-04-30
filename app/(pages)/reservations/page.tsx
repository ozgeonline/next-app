"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth/AuthProvider";
import { useReservations } from "@/hooks/useReservation";
import { cleanupExpiredReservations } from "@/utils/reservations/cleanupExpiredReservations";
import { SavedReservation } from "@/types/reservationTypes";
import type { ClientUser } from "@/types/userTypes";
import { Button } from "@/components/ui/button/Button";
import WavesBackground from "@/components/ui/backgrounds/wavesBackground/WavesBackground";
import styles from "./reservation.module.css";
import {
  ArrowRight,
  Calendar,
  Clock,
  Edit3,
  FileText,
  Leaf,
  Mail,
  Trash2,
  User,
  Users,
} from "lucide-react";

const INITIAL_RESERVATION: SavedReservation = {
  date: "",
  time: "",
  guests: 1,
  notes: "",
};

const GUEST_OPTIONS = [1, 2, 3, 4, 5, 6, 8, 10, 12];

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function getInfoItems(reservation: SavedReservation, user: ClientUser | null) {
  return [
    { label: "Name", value: user?.name || "N/A", icon: <User size={18} /> },
    { label: "Email", value: user?.email || "N/A", icon: <Mail size={18} /> },
    { label: "Date", value: new Date(reservation.date).toLocaleDateString(), icon: <Calendar size={18} /> },
    { label: "Time", value: reservation.time, icon: <Clock size={18} /> },
    { label: "Guests", value: reservation.guests, icon: <Users size={18} /> },
    { label: "Notes", value: reservation.notes || "-", icon: <FileText size={18} /> },
  ];
}

export default function ReservationPage() {
  const { user, loading: authLoading } = useAuth();
  const {
    reservations,
    error: reservationsError,
    refetchReservations,
  } = useReservations();

  const [reservation, setReservation] = useState<SavedReservation>(INITIAL_RESERVATION);
  const [editReservationId, setEditReservationId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [expiredMessage, setExpiredMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const showMessage = (type: "error" | "success", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleEdit = (savedReservation: SavedReservation) => {
    setReservation({
      _id: savedReservation._id || "",
      date: new Date(savedReservation.date).toISOString().split("T")[0],
      time: savedReservation.time,
      guests: savedReservation.guests,
      notes: savedReservation.notes || "",
    });
    setEditReservationId(savedReservation._id || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    if (name === "name" || name === "email") return;

    setReservation((prev) => ({
      ...prev,
      [name]: name === "guests" ? parseInt(value, 10) : value,
    }));
  };

  const validateInputs = () => {
    const parsedDate = new Date(reservation.date);
    if (isNaN(parsedDate.getTime()) || !reservation.time || reservation.guests < 1) {
      showMessage("error", "Please provide a valid date, time, and number of guests.");
      return false;
    }
    return true;
  };

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

  const checkReservationLimit = () => {
    if (!editReservationId && reservations.length > 0) {
      showMessage("error", "You can only have one active reservation.");
      return false;
    }
    return true;
  };

  const buildRequestData = () => ({
    url: editReservationId ? `/api/reservations/${editReservationId}` : "/api/reservations",
    method: editReservationId ? "PUT" : "POST",
    payload: {
      date: new Date(reservation.date).toISOString(),
      time: reservation.time,
      guests: reservation.guests,
      notes: reservation.notes,
    },
  });

  const resetForm = () => {
    setReservation(INITIAL_RESERVATION);
    setEditReservationId(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateInputs() || !checkDateConstraints() || !checkReservationLimit()) return;

    try {
      setIsSubmitting(true);
      const { url, method, payload } = buildRequestData();
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save reservation");

      await refetchReservations();
      showMessage("success", `Reservation ${editReservationId ? "updated" : "created"} successfully.`);
      resetForm();
    } catch (error: unknown) {
      showMessage("error", getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this reservation?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete reservation");

      resetForm();
      await refetchReservations();
      showMessage("success", "Reservation deleted successfully.");
    } catch (error: unknown) {
      showMessage("error", getErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    cleanupExpiredReservations(refetchReservations, setExpiredMessage);
  }, [refetchReservations]);

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
            <Button href="/login" variant="primary" className={styles.loginBtn}>
              Login Now
            </Button>
          </div>
        ) : (
          <>
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
                      {GUEST_OPTIONS.map((num) => (
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

                {reservationsError && (
                  <div className={`${styles.statusMessage} ${styles.error}`}>
                    {reservationsError}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="plain"
                  className={styles.reserveBtn}
                  disabled={isSubmitting}
                  iconRight={<ArrowRight size={20} />}
                >
                  {isSubmitting ? "Processing..." : editReservationId ? "Update Reservation" : "Reserve"}
                </Button>
              </form>
            </div>

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
                    reservations.map((savedReservation) => (
                      <div key={savedReservation._id} className={styles.detailsContainer}>
                        {getInfoItems(savedReservation, user).map((item) => (
                          <div key={item.label} className={styles.detailItem}>
                            <div className={styles.detailLabel}>
                              {item.icon}
                              <span>{item.label}</span>
                            </div>
                            <div className={styles.detailValue}>{item.value}</div>
                          </div>
                        ))}

                        <div className={styles.actionButtons}>
                          <Button
                            type="button"
                            variant="plain"
                            className={styles.editBtn}
                            onClick={() => handleEdit(savedReservation)}
                            disabled={editReservationId === savedReservation._id}
                            iconLeft={<Edit3 size={22} />}
                          >
                            Update Reservation
                          </Button>
                          <Button
                            type="button"
                            variant="plain"
                            className={styles.deleteBtn}
                            onClick={() => handleDelete(savedReservation._id || "")}
                            disabled={isDeleting}
                            iconLeft={<Trash2 size={22} />}
                          >
                            {isDeleting ? "Deleting..." : "Delete Reservation"}
                          </Button>
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
