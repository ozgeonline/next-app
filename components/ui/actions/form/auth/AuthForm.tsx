'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/auth/AuthProvider";
import Link from 'next/link';
import styles from "./auth-form.module.css";

interface FormData {
  formType: "login" | "signup";
  referencePath: string;
  fetchApiPath: string;
  nonTokenPath?: string;
}
export default function AuthForm({
  formType,
  fetchApiPath,
  nonTokenPath,
  referencePath,
}: FormData) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isTouched, setIsTouched] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState("");
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
     setError("");

    try {
      const payload = formType === "login" ? { email: formData.email, password: formData.password } : formData;
      console.log("AuthForm: Sending POST to", `/api/auth/${fetchApiPath}`, payload);

      const res = await fetch(`/api/auth/${fetchApiPath}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("AuthForm: API response:", data);

      if (res.ok) {
        window.dispatchEvent(new CustomEvent("authChange", { detail: { isLogout: false } }));
        console.log("AuthForm: Redirecting to", nonTokenPath || "/profile");
        router.push(nonTokenPath || "/profile");
      } else {
        if (formType === "signup" && data.error?.toLowerCase().includes("already in use")) {
          router.push("/login");
        } else if (formType === "login" && data.error?.toLowerCase().includes("user not found")) {
          router.push("/signup");
        } else {
           setError(data.error || `${formType === "signup" ? "Signup" : "Login"} failed`);
        }
      }
    } catch (err: any) {
      console.error("AuthForm: Submit error:", err);
       setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
      setIsTouched(false);
    }
  };
  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);
  
  const emailIsValid = useMemo(() => validateEmail(formData.email), [formData.email, validateEmail]);
  // if (isLoading) return null; 
  const isFormValid = formType === "login"
    ? emailIsValid && formData.password.length >= 6
    : emailIsValid && formData.name.length >= 2 && formData.password.length >= 6;
    

  return (
    <div className={styles.formWrapper}>
      {/* <div className={styles.containerTopNavbar} /> */}
      {loading ? (
        <div className={styles.loading}>
          Loading...
        </div>
      ) : (
        <>
        <h2>{formType}</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              name="name"
              type="text"
              placeholder="Name"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              onBlur={() => setIsTouched(true)}
              required
              className={`
                ${formData.name ? `${styles.validValueColor}` 
                  : !formData.name && isTouched ? `${styles.invalidValueColor}` 
                  : `${styles.defaultValueColor}`
                }
              `}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="name">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              onBlur={() => setIsTouched(true)}
              required
              className={`
                ${(formData.name && emailIsValid) ? `${styles.validValueColor}` 
                  : (!formData.name || !emailIsValid) && isTouched ? `${styles.invalidValueColor}` 
                  : `${styles.defaultValueColor}`
                }
              `}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="name">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className={`
                ${formData.name ? `${styles.validValueColor}` 
                  : !formData.name && isTouched ? `${styles.invalidValueColor}` 
                  : `${styles.defaultValueColor}`
                }
              `}
            />
          </div>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? "Submitting..." : formType === "login" ? "Login" : "Sign Up"}
          </button>
          <h3>Already have an account?</h3>
          <Link
            href={referencePath}
            type="submit"
            className={styles.referencePath}
          >
            {referencePath}
          </Link>
        </form>
        </>
      )}
    </div>
  );
}