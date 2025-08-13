"use client";

import { useAuth } from "@/hooks/useAuth";
import styles from "./auth.module.css";

export default function AuthLayout({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  //const [name, setName] = useState("");
  //const [hasToken, setHasToken] = useState(true);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const res = await fetch("/api/auth/user", {
  //         credentials: "include",
  //       });
  //       const data = await res.json();
  //       if (res.ok) {
  //         setName(data.user.name || "Guest");
  //         setHasToken(true);
  //       } else {
  //         console.log("No valid user data:", data.error);
  //         setName("Guest");
  //         setHasToken(false);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //       setName("Guest");
  //       setHasToken(false);
  //     }
  //   };
  //   fetchUserData();
  // }, []);

    if (loading) {
    return (
      <div className={styles.containerWrapper}>
        <div>Loading...</div>
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
    <div className={styles.containerWrapper}>
      <div className={styles.card}>
        <div className={styles.userCard}>
          <div className={styles.top}>
            <div className={styles.name}>
              Hello, {user?.name || "Guest"}
            </div>
          </div>
          <div className={styles.bottom}>
            <button type="button" className={styles.button} onClick={handleSignout}>
              sign out
            </button>
          </div>
        </div>
        <div className={styles.avatar}>
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