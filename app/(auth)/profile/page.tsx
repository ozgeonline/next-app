"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth/AuthProvider";
import { updateUserNameAction } from "@/lib/actions/auth";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const { user, isAuthenticated, mutateUser } = useAuth();
  const [showInput, setShowInput] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      <div className={styles.card}>
        <div className={styles.profileWrapper}>
          {isAuthenticated ? (
            // Authenticated Profile
            <div className={styles.authProfile}>
              <h3>Profile</h3>
              <div className={styles.profileInfo}>
                <p className={styles.mailInfo}>
                  <span>mail</span> : {user?.email}
                </p>
                <p className={styles.nameInfo}>
                  <span>name</span> : {user?.name || "Not set"}
                </p>
              </div>
              <h3>Update account name:</h3>
              <div className={styles.updateSection}>
                {error && <p className={styles.errorMessage}>Error: {error}</p>}
                {!showInput ? (
                  <button
                    onClick={handleShowInput}
                    className="theme-accent-gold-blue"
                  >
                    Update
                  </button>
                ) : (
                  <>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Enter new name"
                      className="theme-accent-gold-blue"
                    />
                    <button
                      onClick={handleUpdate}
                      disabled={saving}
                      className="theme-accent-gold-blue"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => setShowInput(false)}
                      className="theme-accent-gold-blue"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            // Not Authenticated Profile
            <div className={styles.nonAuthProfile}>
              <Link
                href="/signup"
                type="submit"
                className="theme-accent-gold-blue"
              >
                Sign Up
              </Link>
              <h3>Already have an account?</h3>
              <Link
                href="/login"
                type="submit"
                className="theme-accent-gold-blue"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}