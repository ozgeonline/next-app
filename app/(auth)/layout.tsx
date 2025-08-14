"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import styles from "./auth.module.css";

export default function AuthLayout({ children }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className={styles.containerWrapper + " " + styles.darkGradient + " " + styles.lightGradient}>
        <h3 className={styles.loading}>Loading...</h3>
      </div>
    );
  }

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        window.location.reload();
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <div className={styles.containerWrapper + " " + styles.darkGradient + " " + styles.lightGradient}>
      <div className={styles.card}>
        <div className={styles.userCard + " " + styles.darkGradient + " " + styles.lightGradient}>
          <div className={styles.top}>
            <div className={styles.name}>
              Hello, {user?.name || "Guest"}
            </div>
          </div>

          {isAuthenticated ? (
            <div className={styles.bottom}>
              <button
                type="button"
                className={styles.button + " " + styles.darkGradient + " " + styles.lightGradient}
                onClick={handleSignout}
              >
                logout
              </button>
              <Link
                href="/reservation"
                className={styles.button + " " + styles.darkGradient + " " + styles.lightGradient}
              >
                my reservations
              </Link>
            </div>
          ) : (
            <div className={styles.bottom}>
              <span className={styles.forReservation}>Log in to make a reservation</span>
            </div>
          )}
        </div>
        
        <div className={styles.avatar + "  " + styles.darkGradient + " " + styles.lightGradient}>
          {user?.name.slice(0, 2)}
        </div>
      </div>

      {!isAuthenticated && (
        <div className={styles.card}>
          {children}
        </div>
      )}
    </div>
  );
}