"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/hooks/useAuth";
import styles from "./reservation.module.css";
export default function ReservationPage() {
  const { user, loading, isAuthenticated } = useAuth();
  // const router = useRouter();
  // const [isLoading, setIsLoading] = useState(true);
  //const token = localStorage.getItem('token');

    if (loading) {
    return (
      <div className={styles.containerWrapper}>
        <div>Loading...</div>
      </div>
    );
  }
  return (
    <div className={styles.containerWrapper}>
      <div className={styles.containerTopNavbar} />
      {!isAuthenticated && (
        <div>
          non Auth
        </div>
      )}

      {isAuthenticated && (
        <div>
          Auth Reservation Page
        </div>
      )}
    </div>
  )
}