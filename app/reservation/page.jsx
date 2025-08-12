"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import styles from "./reservation.module.css";
export default function ReservationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem('token');

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.containerTopNavbar} />
      {!token && (
        <div>
          non Auth
        </div>
      )}

      {token && (
        <div>
          Auth Reservation Page
        </div>
      )}
    </div>
  )
}