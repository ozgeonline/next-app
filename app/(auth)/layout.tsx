"use client";

import { ReactNode, useEffect } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth/AuthProvider";
import styles from "./auth.module.css";
import TopScrollButton from '@/components/ui/topScrollButton/TopScrollButton';
import { Leaf, LogOut, Calendar, User as UserIcon } from 'lucide-react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
      router.push("/profile");
    }
  }, [isAuthenticated, pathname, router, loading]);

  const handleSignout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      router.push("/profile");
    }
  };

  if (loading || (isAuthenticated && (pathname === "/login" || pathname === "/signup"))) {
    return (
      <div className={styles.loadingWrapper}>
        <h3 className={styles.loadingText}>Loading...</h3>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className="containerTopNavbarColor" />

      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.watermarkText}>ACCOUNT</div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Your Account</h1>
          <div className={styles.decorativeDivider}>
            <div className={styles.line} />
            <Leaf className={styles.dividerLeaf} size={24} />
            <div className={styles.line} />
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className={styles.mainContent}>
        {/* IDENTITY CARD (LEFT) */}
        <div className={styles.identityCard}>
          <div className={styles.avatarCircle}>
            {user?.name ? user.name.slice(0, 2).toUpperCase() : <UserIcon size={40} />}
          </div>

          <div className={styles.userInfo}>
            <h2 className={styles.userName}>{user?.name || "Guest"}</h2>
            <p className={styles.userSub}>{user?.email || "Join our community"}</p>
          </div>

          <div className={styles.actionStack}>
            {isAuthenticated ? (
              <>
                <Link href="/reservations" className={`${styles.actionBtn} ${styles.primaryAction}`}>
                  <Calendar size={18} /> My Reservations
                </Link>
                <button onClick={handleSignout} className={styles.logoutBtn}>
                  <LogOut size={16} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={`${styles.actionBtn} ${styles.primaryAction}`}>
                  Login
                </Link>
                <Link href="/signup" className={`${styles.actionBtn} ${styles.secondaryAction}`}>
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>

        {/* CONTENT CARD (RIGHT) */}
        <div className={styles.contentCard}>
          {children}
        </div>
      </main>

      <TopScrollButton />
    </div>
  );
}