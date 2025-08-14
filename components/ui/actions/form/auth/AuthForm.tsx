'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from "./auth-form.module.css";
import Link from 'next/link';

interface FormData {
  formType: string;
  fetchApiPath: string;
  nonTokenPath?: string;
  referencePath: string;
}
export default function AuthForm({
  formType,
  fetchApiPath,
  nonTokenPath,
  referencePath,
}: FormData) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isTouched, setIsTouched] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/user", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (data?.user && nonTokenPath) {
            router.push(nonTokenPath);
          }
        }
      } catch (err) {
        console.error("Auth check error:", err);
      }
    }
    checkAuth();
  }, [nonTokenPath, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/auth/${fetchApiPath}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    //console.log("API res:", data);

    if (res.ok) {
      router.push(nonTokenPath || "/reservation");
    } else {
      if (formType === "signup" && data.error?.toLowerCase().includes("already in use")) {
        router.push("/login");
      } else {
        alert( formType === "signup" ? "Signup failed" : "Login failed");
        //console.log("auth Error:",data.error)
      }
    }
    setIsTouched(false);
  };

  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);
  
  const emailIsValid = useMemo(() => validateEmail(formData.email), [formData.email, validateEmail]);
  // if (isLoading) return null; 

  return (
    <div className={styles.formWrapper}>
      {/* <div className={styles.containerTopNavbar} /> */}
      <h2>{formType}</h2>
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
        >
          {formType}
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
    </div>
  );
}
