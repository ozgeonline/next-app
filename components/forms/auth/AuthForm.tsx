'use client';

import { useState, useMemo, useCallback } from 'react';
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
  const { loading, mutateUser } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const payload =
        formType === "login"
          ? { email: formData.email, password: formData.password }
          : formData;
      //console.log("AuthForm: Sending POST to", `/api/auth/${fetchApiPath}`, payload);

      const res = await fetch(`/api/auth/${fetchApiPath}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      //console.log("AuthForm: API response:", data);

      if (res.ok) {
        window.dispatchEvent(new CustomEvent("authChange", { detail: { isLogout: false } }));
        //console.log("AuthForm: Redirecting to", nonTokenPath || "/profile");
        mutateUser();
        router.push(nonTokenPath || "/profile");
      } else {
        const errorMsg = data.error?.toLowerCase() || "";

        if (formType === "signup" && errorMsg.includes("already in use")) {
          router.push("/login");
        } else if (formType === "login" && errorMsg.includes("user not found")) {
          router.push("/signup");
        } else {
          setError(data.error || `${formType === "signup" ? "Signup" : "Login"} failed`);
        }
      }
    } catch (err: any) {
      //console.error("AuthForm: Submit error:", err);
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

  const isFormValid = formType === "login"
    ? emailIsValid && formData.password.length >= 6
    : emailIsValid && formData.name.length >= 2 && formData.password.length >= 6;

  const getInputClassName = (isValid: boolean, value: string) => {
    if (value && isValid) return styles.validValueColor;
    if ((!value || !isValid) && isTouched) return styles.invalidValueColor;
    return styles.defaultValueColor;
  };

  const formFields = [
    {
      name: "name",
      type: "text",
      placeholder: "Name",
      label: "Name",
      condition: formType === "signup",
      isValid: formData.name.length >= 2,
      errorMessage: "Please enter 2 or more characters",
    },
    {
      name: "email",
      type: "email",
      placeholder: "Email",
      label: "Email",
      condition: true,
      isValid: emailIsValid,
      errorMessage: null,
    },
    {
      name: "password",
      type: "password",
      placeholder: "Password",
      label: "Password",
      condition: true,
      isValid: formData.password.length >= 6,
      errorMessage: "Please enter 6 or more characters",
      autoComplete: "new-password"
    }
  ];

  return (
    <div className={styles.formWrapper}>
      {loading ? (
        <div className={styles.loading}>
          Loading...
        </div>
      ) : (
        <>
          <h2>{formType}</h2>
          {error && <p className={styles.error}>{error}</p>}

          <form onSubmit={handleSubmit} className={styles.form}>
            {formFields.map((field) => (
              field.condition && (
                <div key={field.name} className={styles.formGroup}>
                  <label htmlFor={field.name}>{field.label}</label>
                  <input
                    name={field.name}
                    type={field.type}
                    id={field.name}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    onBlur={() => setIsTouched(true)}
                    required
                    className={getInputClassName(field.isValid, formData[field.name as keyof typeof formData])}
                  />
                  <span className={styles.error}>
                    {!field.isValid && isTouched && field.errorMessage}
                  </span>
                </div>
              )
            ))}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting
                ? "Submitting..."
                : formType === "login"
                  ? "Login"
                  : "Sign Up"
              }
            </button>
            <h3>Already have an account?</h3>
            <Link
              href={referencePath}
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