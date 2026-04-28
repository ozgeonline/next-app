"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { useAuth } from "@/context/auth/AuthProvider";
import { useTheme } from "@/context/theme/ThemeProvider";
import { updateUserNameAction } from "@/lib/actions/auth";
import styles from "./profile.module.css";
import { Mail, User as UserIcon, Settings, Moon, Sun, Utensils, Edit3, X, Check } from "lucide-react";

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

  if (!isAuthenticated) {
    return (
      <div className={styles.nonAuthProfile}>
        <h2 className={styles.nonAuthTitle}>Join our community</h2>
        <p className={styles.profileSub}>Create an account to save your recipes and manage reservations.</p>
        <div className={styles.authBtnStack}>
          <Link href="/signup" className={`${styles.authBtn} ${styles.primaryAuth}`}>
            Create Account
          </Link>
          <Link href="/login" className={`${styles.authBtn} ${styles.secondaryAuth}`}>
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h1 className={styles.profileTitle}>Profile Details</h1>
        <p className={styles.profileSub}>Manage your account information and app preferences.</p>
      </div>

      <div className={styles.detailsGrid}>
        {/* Email Block */}
        <div className={styles.detailBlock}>
          <div className={styles.blockLabelRow}>
            <Mail size={16} />
            <span className={styles.blockLabel}>Email Address</span>
          </div>
          <div className={styles.blockValue}>{user?.email}</div>
        </div>

        {/* Name Block */}
        <div className={styles.detailBlock}>
          <div className={styles.blockLabelRow}>
            <UserIcon size={16} />
            <span className={styles.blockLabel}>Account Name</span>
          </div>
          <div className={styles.blockValue}>{user?.name || "Not set"}</div>
        </div>

        {/* Theme Settings Block */}
        <div className={styles.detailBlock}>
          <div className={styles.blockLabelRow}>
            <Settings size={16} />
            <span className={styles.blockLabel}>App Theme</span>
          </div>
          <div className={styles.themeToggle}>
            <div className={styles.blockValue}>
              {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
              <span style={{ marginLeft: '0.5rem', textTransform: 'capitalize' }}>{theme} Mode</span>
            </div>
            <button onClick={toggleTheme} className={styles.toggleBtn}>
              Switch
            </button>
          </div>
        </div>

        {/* Recipes Metric Block */}
        <div className={styles.detailBlock}>
          <div className={styles.blockLabelRow}>
            <Utensils size={16} />
            <span className={styles.blockLabel}>Recipes Shared</span>
          </div>
          <div className={styles.metricValue}>{recipesCount}</div>
        </div>
      </div>

      {/* Account Settings / Edit Name */}
      <div className={styles.updateSection}>
        <h3 className={styles.updateTitle}>Account Settings</h3>

        {error && <div className={styles.errorMessage}>{error}</div>}

        {!showInput ? (
          <button onClick={handleShowInput} className={styles.editBtn}>
            <Edit3 size={18} /> Edit Account Name
          </button>
        ) : (
          <div className={styles.editForm}>
            <div className={styles.inputWrapper}>
              <UserIcon className={styles.inputIcon} size={20} />
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter new name"
                className={styles.ghostInput}
                autoFocus
              />
            </div>
            <div className={styles.actionRow}>
              <button onClick={() => setShowInput(false)} className={styles.cancelBtn}>
                <X size={18} /> <span className={styles.btnText}>Cancel</span>
              </button>
              <button onClick={handleUpdate} disabled={saving} className={styles.saveBtn}>
                {saving ? "Saving..." : <><Check size={18} /> <span className={styles.btnText}>Save Changes</span></>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}