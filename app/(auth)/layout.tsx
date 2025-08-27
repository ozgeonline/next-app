"use client";

import { ReactNode, useEffect } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth/AuthProvider";
import styles from "./auth.module.css";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, loading, setIsLogout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  // console.log("AuthLayout state:", {
  //   user,
  //   isAuthenticated,
  //   loading,
  //   pathname
  // });

// Redirect to /profile if auth
  useEffect(() => {
    if (loading) return;
    if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
      //console.log("AuthLayout: auth user, redirecting to /profile");
      router.push("/profile");
    }
  }, [isAuthenticated, pathname, router, loading]);

  const handleSignout = async () => {
    const event = new CustomEvent("authChange", { detail: { isLogout: true }});
    
    try {
      //console.log("AuthLayout: sending POST to /api/auth/logout");
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        //console.log("AuthLayout: logout successful, redirecting to /login");
        setIsLogout(true);
        window.dispatchEvent(event);
        router.push("/profile");
      } else {
        //console.error("AuthLayout: logout failed");
        //await new Promise((resolve) => setTimeout(resolve, 100));
        window.dispatchEvent(event);
        router.push("/profile");
      }
    } catch (err) {
      //console.error("AuthLayout: error logout:", err);
      window.dispatchEvent(event);
      router.push("/profile");
    }
  };

  if (loading || (isAuthenticated && (pathname === "/login" || pathname === "/signup"))) {
    return (
      <div className={`${styles.containerWrapper} ${styles.gradientBackground}`}>
        <h3 className={styles.loading}>Loading...</h3>
      </div>
    );
  }

  return (
    <div className={styles.containerWrapper + " " + styles.darkGradient + " " + styles.lightGradient}>
      <div className={styles.card}>
        <div className={styles.userCard + " " + styles.darkGradient}>
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
                href="/reservations"
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
          {user?.name ? user.name.slice(0, 2).toUpperCase() : "G"}
        </div>
      </div>

      <div className={styles.card}>
        {children}
      </div>
    </div>
  );
}