'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/auth/AuthProvider";
import { loginAction, signupAction } from "@/lib/actions/auth";
import Link from 'next/link';
import styles from "./auth-form.module.css";

interface FormData {
  formType: "login" | "signup";
  referencePath: string;
  redirectTo?: string;
}

export default function AuthForm({
  formType,
  redirectTo = "/profile",
  referencePath,
}: FormData) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { loading, mutateUser } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const result = formType === "login"
        ? await loginAction(formData.email, formData.password)
        : await signupAction(formData.name, formData.email, formData.password);

      if (result.success) {
        window.dispatchEvent(new CustomEvent("authChange", { detail: { isLogout: false } }));
        mutateUser();
        router.push(redirectTo);
      } else {
        if (result.redirectTo) {
          router.push(result.redirectTo);
        } else {
          setError(result.error || `${formType === "signup" ? "Signup" : "Login"} failed`);
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setIsSubmitting(false);
      setTouchedFields({});
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

  const getInputClassName = (fieldName: string, isValid: boolean, value: string) => {
    if (value && isValid) return styles.validValueColor;
    if ((!value || !isValid) && touchedFields[fieldName]) return styles.invalidValueColor;
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
                    onBlur={() => setTouchedFields(prev => ({ ...prev, [field.name]: true }))}
                    required
                    className={getInputClassName(field.name, field.isValid, formData[field.name as keyof typeof formData])}
                  />
                  <span className={styles.error}>
                    {!field.isValid && touchedFields[field.name] && field.errorMessage}
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
            <h3>
              {formType === "login"
                ? "Don't have an account?"
                : "Already have an account?"
              }
            </h3>

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