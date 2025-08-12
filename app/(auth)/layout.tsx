"use client";

import { useEffect, useState } from "react";
import styles from "./auth.module.css";

export default function AuthLayout({ children }) {
  const [name, setName] = useState("");
  const [hasToken, setHasToken] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/auth/user", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setName(data.user.name || "Guest");
          setHasToken(true);
        } else {
          console.log("No valid user data:", data.error);
          setName("Guest");
          setHasToken(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setName("Guest");
        setHasToken(false);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.card}>
        <div className={styles.userCard}>
          <div className={styles.top}>
            <div className={styles.name}>
              Hello, {name}
            </div>
          </div>
          <div className={styles.bottom}>
            Signout Button will go here
          </div>
        </div>
        <div className={styles.avatar}>
          {name.slice(0, 2)}
        </div>
      </div>
      {!hasToken && (
        <div className={styles.card}>
          {children}
        </div>
      )}
    </div>
  );
}