"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth/AuthProvider";
import { useToast } from "@/context/toast/ToastProvider";
import { useReservations } from "@/hooks/useReservation";
import { cleanupExpiredReservations } from "@/utils/reservations/cleanupExpiredReservations";
import { SavedReservation } from "@/types/reservationTypes";
import type { ClientUser } from "@/types/userTypes";
import { Button } from "@/components/ui/button/Button";
import WavesBackground from "@/components/ui/backgrounds/wavesBackground/WavesBackground";
import {
  canEditReservation,
  getReservationDateTime,
  isPastReservation,
  MAX_RESERVATION_EDITS,
  RESERVATION_EDIT_CUTOFF_HOURS,
} from "@/lib/reservations";
import styles from "./reservation.module.css";
import {
  ArrowRight,
  Calendar,
  Clock,
  Edit3,
  FileText,
  Leaf,
  Mail,
  XCircle,
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
  return error instanceof Error ? error.message : "Request could not be completed. Please try again.";
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

function getReservationStatusLabel(reservation: SavedReservation) {
  if (reservation.status === "cancelled") return "Cancelled";
  if (isPastReservation(reservation.date, reservation.time)) return "Past";
  return "Active";
}

function getReservationStatusClass(reservation: SavedReservation) {
  if (reservation.status === "cancelled") return styles.cancelledStatus;
  if (isPastReservation(reservation.date, reservation.time)) return styles.pastStatus;
  return styles.activeStatus;
}

function sortReservationsByDate(direction: "asc" | "desc") {
  return (first: SavedReservation, second: SavedReservation) => {
    const firstTime = getReservationDateTime(first.date, first.time).getTime();
    const secondTime = getReservationDateTime(second.date, second.time).getTime();
    return direction === "asc" ? firstTime - secondTime : secondTime - firstTime;
  };
}

export default function ReservationPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const {
    reservations,
    error: reservationsError,
    refetchReservations,
  } = useReservations();

  const [reservation, setReservation] = useState<SavedReservation>(INITIAL_RESERVATION);
  const [editReservationId, setEditReservationId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const upcomingReservations = reservations.filter((savedReservation) => (
    savedReservation.status !== "cancelled" &&
    !isPastReservation(savedReservation.date, savedReservation.time)
  )).sort(sortReservationsByDate("asc"));
  const pastReservations = reservations.filter((savedReservation) => (
    savedReservation.status !== "cancelled" &&
    isPastReservation(savedReservation.date, savedReservation.time)
  )).sort(sortReservationsByDate("desc"));
  const cancelledReservations = reservations.filter((savedReservation) => (
    savedReservation.status === "cancelled"
  )).sort(sortReservationsByDate("desc"));

  const handleEdit = (savedReservation: SavedReservation) => {
    if (!canEditReservation(savedReservation)) {
      toast.warning(
        `Reservations can be edited up to ${MAX_RESERVATION_EDITS} times and not within ${RESERVATION_EDIT_CUTOFF_HOURS} hours of the reservation time.`
      );
      return;
    }

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
      toast.error("Please provide a valid date, time, and number of guests.");
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
      toast.error("You cannot make a reservation for a past date.");
      return false;
    }

    if (isToday) {
      const [hours, minutes] = reservation.time.split(":").map(Number);
      const now = new Date();
      now.setSeconds(0, 0);

      const selected = new Date();
      selected.setHours(hours, minutes, 0, 0);

      if (selected <= now) {
        toast.error("You cannot select a past time for today.");
        return false;
      }
    }

    return true;
  };

  const checkReservationLimit = () => {
    if (!editReservationId && upcomingReservations.length > 0) {
      toast.warning("You can only have one upcoming active reservation.");
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
      toast.success(`Reservation ${editReservationId ? "updated" : "created"} successfully.`);
      resetForm();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this reservation?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Reservation could not be cancelled. Please try again.");

      resetForm();
      await refetchReservations();
      toast.success("Reservation cancelled successfully.");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const renderReservationList = (
    title: string,
    list: SavedReservation[],
    emptyText: string
  ) => (
    <section className={styles.reservationGroup}>
      <div className={styles.groupHeader}>
        <h3>{title}</h3>
        <span>{list.length}</span>
      </div>

      {list.length > 0 ? (
        list.map((savedReservation) => {
          const editable = canEditReservation(savedReservation);

          return (
            <div key={savedReservation._id} className={styles.detailsContainer}>
              <div className={styles.statusRow}>
                <span className={`${styles.statusBadge} ${getReservationStatusClass(savedReservation)}`}>
                  {getReservationStatusLabel(savedReservation)}
                </span>
                <span className={styles.editMeta}>
                  Edits used: {savedReservation.editCount || 0}/{MAX_RESERVATION_EDITS}
                </span>
              </div>

              {getInfoItems(savedReservation, user).map((item) => (
                <div key={item.label} className={styles.detailItem}>
                  <div className={styles.detailLabel}>
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <div className={styles.detailValue}>{item.value}</div>
                </div>
              ))}

              {savedReservation.status === "active" && !isPastReservation(savedReservation.date, savedReservation.time) && (
                <div className={styles.actionButtons}>
                  <Button
                    type="button"
                    variant="plain"
                    className={styles.editBtn}
                    onClick={() => handleEdit(savedReservation)}
                    disabled={!editable || editReservationId === savedReservation._id}
                    iconLeft={<Edit3 size={22} />}
                  >
                    Update Reservation
                  </Button>
                  <Button
                    type="button"
                    variant="plain"
                    className={styles.deleteBtn}
                    onClick={() => handleCancel(savedReservation._id || "")}
                    disabled={isDeleting}
                    iconLeft={<XCircle size={22} />}
                  >
                    {isDeleting ? "Cancelling..." : "Cancel Reservation"}
                  </Button>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className={styles.emptyState}>
          <p>{emptyText}</p>
        </div>
      )}
    </section>
  );

  useEffect(() => {
    cleanupExpiredReservations(refetchReservations, (message) => toast.info(message));
  }, [refetchReservations, toast]);

  useEffect(() => {
    if (reservationsError) {
      toast.error(reservationsError);
    }
  }, [reservationsError, toast]);

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
                  {renderReservationList("Upcoming Reservations", upcomingReservations, "No upcoming reservations found.")}
                  {renderReservationList("Past Reservations", pastReservations, "No past reservations yet.")}
                  {renderReservationList("Cancelled Reservations", cancelledReservations, "No cancelled reservations.")}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
