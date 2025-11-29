"use client";

import { ReactNode, useEffect } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth/AuthProvider";
import styles from "./auth.module.css";
import TopScrollButton from '@/components/ui/topScrollButton/TopScrollButton';

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, loading, logout } = useAuth();
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
    try {
      await logout();
      router.push("/profile");
    } catch (err) {
      logout();
      router.push("/profile");
    } finally {
      logout();
      router.push("/profile");
    }
  };

  if (loading || (isAuthenticated && (pathname === "/login" || pathname === "/signup"))) {
    return (
      <div className={`${styles.containerWrapper} background-gradient`}>
        <h3 className={styles.loading}>Loading...</h3>
      </div>
    );
  }

  return (
    <div className={styles.containerWrapper + " " + "mainBackground"}>
      <div className={styles.containerTopNavbar} />
      <div className={styles.card}>
        <div className={styles.avatar}>
          {user?.name ? user.name.slice(0, 2).toUpperCase() : "G"}
        </div>
        <div className={styles.userCard}>
          <div className={styles.top}>
            <div className={styles.name}>
              Hello, {user?.name || "Guest"}
            </div>
          </div>

          {isAuthenticated ? (
            <div className={styles.bottom}>
              <button
                type="button"
                className={styles.button + " blueButton"}
                onClick={handleSignout}
              >
                logout
              </button>
              <Link
                href="/reservations"
                className={styles.button + " blueButton"}
              >
                my reservations
              </Link>
            </div>
          ) : (
            <div className={styles.bottom}>
              <span className={styles.nonauth}>Login for account information</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.card}>
        {children}
      </div>

      <TopScrollButton />
    </div>
  );
}