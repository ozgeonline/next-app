"use client";

import { useState } from "react";
import useSWR from "swr";
import { useAuth } from "@/context/auth/AuthProvider";
import { useTheme } from "@/context/theme/ThemeProvider";
import { Button } from "@/components/ui/button/Button";
import { updateUserNameAction } from "@/lib/actions/auth";
import styles from "./profile.module.css";
import { Mail, User as UserIcon, Settings, Moon, Sun, Utensils, Edit3, X, Check } from "lucide-react";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

type MealSummary = {
  id: string;
};

export default function ProfilePage() {
  const { user, isAuthenticated, mutateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [showInput, setShowInput] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: sharedMealsData } = useSWR<{ meals: MealSummary[] }>(
    isAuthenticated ? "/api/meals/shared" : null,
    fetcher
  );

  const recipesCount = sharedMealsData?.meals.length || 0;

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
          <Button href="/signup" variant="plain" className={`${styles.authBtn} ${styles.primaryAuth}`}>
            Create Account
          </Button>
          <Button href="/login" variant="plain" className={`${styles.authBtn} ${styles.secondaryAuth}`}>
            Login
          </Button>
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
              <span className={styles.themeName}>{theme} Mode</span>
            </div>
            <Button onClick={toggleTheme} variant="plain" className={styles.toggleBtn}>
              Switch
            </Button>
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
          <Button
            onClick={handleShowInput}
            variant="plain"
            className={styles.editBtn}
            iconLeft={<Edit3 size={18} />}
          >
            Edit Account Name
          </Button>
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
              <Button
                onClick={() => setShowInput(false)}
                variant="plain"
                className={styles.cancelBtn}
                iconLeft={<X size={18} />}
              >
                <span className={styles.btnText}>Cancel</span>
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={saving}
                variant="plain"
                className={styles.saveBtn}
                iconLeft={saving ? undefined : <Check size={18} />}
              >
                {saving ? "Saving..." : <span className={styles.btnText}>Save Changes</span>}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
