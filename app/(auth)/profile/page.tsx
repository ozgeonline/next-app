"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth/AuthProvider";
import styles from "./profile.module.css";

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [showInput, setShowInput] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);

  // useEffect(() => {
  //   console.log("loading:", loading);
  // }, [loading]);
  
   if (loading) {
    return (
      <div>
        <h3 className={styles.loading}>Loading...</h3>
      </div>
    );
  }

  const handleUpdate = async () => {
    if (!newName.trim()) return;

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
        window.dispatchEvent(new CustomEvent("authChange"));
        setShowInput(false);
        setNewName("");
      } else {
        //console.error(await res.json());
      }
    } catch (err) {
      //console.error("Update error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.card}>
        <div className={styles.profileWrapper}>
          {!isAuthenticated ? (
            // Not Authenticated Profile
            <>
              <Link
                href="/signup"
                type="submit"
                className={styles.referencePathBtn}
              >
                Sign Up
              </Link>
              <h3>Already have an account?</h3>
              <Link
                href="/login"
                type="submit"
                className={styles.referencePathBtn}
              >
                Login
              </Link>
            </>
          ) : (
            // Authenticated Profile
            <div className={styles.authProfile}>
              <h3>Profile</h3>
              <div className={styles.profileInfo}>
                <p className={styles.mailInfo}>
                  <span>mail:</span> {user?.email}
                </p>
                <p className={styles.nameInfo}>
                  <span>name:</span> {user?.name || "Not set"}
                </p>
              </div>
              <h3>Update account name:</h3>
              <div className={styles.updateSection}>
                 {!showInput ? (
                <button onClick={() => setShowInput(true)}>Update</button>
              ) : (
                <>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter new name"
                  />
                  <button onClick={handleUpdate} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button onClick={() => setShowInput(false)}>Cancel</button>
                </>
              )}
              </div>
             
            </div>
          )}
        </div>
      </div>
    </div>
  )
}