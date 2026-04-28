"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { useAuth } from "@/context/auth/AuthProvider";
import { useTheme } from "@/context/theme/ThemeProvider";
import { updateUserNameAction } from "@/lib/actions/auth";
import styles from "./profile.module.css";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

export default function ProfilePage() {
  const { user, isAuthenticated, mutateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [showInput, setShowInput] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: allMeals } = useSWR(isAuthenticated ? '/api/meals/meal' : null, fetcher);

  const recipesCount = allMeals?.filter(
    (meal: any) => meal.creator_email === user?.email
  ).length || 0;

  const handleUpdate = async () => {
    if (!newName.trim()) return;
    setError(null);
    setSaving(true);

    try {
      const result = await updateUserNameAction(newName);

      if (result.success) {
        mutateUser();
        setShowInput(false);
        setNewName("");
      } else {
        setError(result.error || "Update failed.");
      }
    } catch (err: unknown) {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleShowInput = () => {
    setShowInput(true);
    setNewName(user?.name || "");
  };

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.profileWrapper}>
        {isAuthenticated ? (
          // Authenticated Profile
          <div className={styles.authProfile}>
            <div className={styles.detailsGrid}>

              {/* Email Block */}
              <div className={styles.glassBlock}>
                <div className={styles.blockLabel}>Email Address</div>
                <div className={styles.blockValue}>{user?.email}</div>
              </div>

              {/* Name Block */}
              <div className={styles.glassBlock}>
                <div className={styles.blockLabel}>Account Name</div>
                <div className={styles.blockValue}>{user?.name || "Not set"}</div>
              </div>

              {/* Theme Settings Block */}
              <div className={styles.glassBlock}>
                <div className={styles.blockLabel}>App Theme</div>
                <div className={styles.themeToggleRow}>
                  <div className={styles.blockValue}>Current: {theme}</div>
                  <button onClick={toggleTheme} className={styles.themeButton}>
                    Toggle Theme
                  </button>
                </div>
              </div>

              {/* Recipes Metric Block */}
              <div className={styles.glassBlock}>
                <div className={styles.blockLabel}>Recipes Created</div>
                <div className={styles.statValue}>{recipesCount}</div>
              </div>

            </div>

            {/* Account Settings / Edit Name */}
            <div className={styles.updateSection}>
              <div className={styles.updateHeader}>Update Settings</div>

              {error && <p className={styles.errorMessage}>Error: {error}</p>}

              {!showInput ? (
                <button
                  onClick={handleShowInput}
                  className={styles.ghostButton}
                  style={{ width: "max-content", marginTop: "0.5rem" }}
                >
                  Edit Account Name
                </button>
              ) : (
                <>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter new name"
                    className={styles.ghostInput}
                    autoFocus
                  />
                  <div className={styles.actionRow}>
                    <button
                      onClick={() => setShowInput(false)}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdate}
                      disabled={saving}
                      className={styles.ghostButton}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          // Not Authenticated Profile
          <div className={styles.nonAuthProfile}>
            <h4>Join our community or login to continue</h4>
            <Link href="/signup" className={styles.primaryAuthButton}>
              Create Account
            </Link>
            <Link href="/login" className={styles.secondaryAuthButton}>
              Login securely
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}