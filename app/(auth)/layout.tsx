"use client";

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth/AuthProvider";
import { Button } from "@/components/ui/button/Button";
import FavoriteCountBadge from "@/components/favorites/favorite-count-badge/FavoriteCountBadge";
import styles from "./auth.module.css";
import TopScrollButton from '@/components/ui/topScrollButton/TopScrollButton';
import { Leaf, LogOut, Calendar, Heart, User as UserIcon } from 'lucide-react';

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
    await logout();
    router.push("/profile");
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
                <Button
                  href="/reservations"
                  variant="plain"
                  className={`${styles.actionBtn} ${styles.primaryAction}`}
                  iconLeft={<Calendar size={18} />}
                >
                  My Reservations
                </Button>
                <Button
                  href="/favorites"
                  variant="plain"
                  className={`${styles.actionBtn} ${styles.secondaryAction}`}
                >
                  <span className={styles.actionLabel}>
                    <Heart size={18} />
                    <span>Favorite Meals</span>
                  </span>
                  <FavoriteCountBadge />
                </Button>
                <Button
                  onClick={handleSignout}
                  variant="plain"
                  className={styles.logoutBtn}
                  iconLeft={<LogOut size={16} />}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button href="/login" variant="plain" className={`${styles.actionBtn} ${styles.primaryAction}`}>
                  Login
                </Button>
                <Button href="/signup" variant="plain" className={`${styles.actionBtn} ${styles.secondaryAction}`}>
                  Create Account
                </Button>
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
