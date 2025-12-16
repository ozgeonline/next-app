"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth/AuthProvider";
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
      const res = await fetch("/api/auth/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name: newName }),
      });

      if (res.ok) {
        mutateUser();
        setShowInput(false);
        setNewName("");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Update failed.");
      }
    } catch (err) {
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
                    className="button-gold-blue"
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
                      className="button-gold-blue"
                    />
                    <button
                      onClick={handleUpdate}
                      disabled={saving}
                      className="button-gold-blue"
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => setShowInput(false)}
                      className="button-gold-blue"
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
                className="button-gold-blue"
              >
                Sign Up
              </Link>
              <h3>Already have an account?</h3>
              <Link
                href="/login"
                type="submit"
                className="button-gold-blue"
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