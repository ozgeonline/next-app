"use client";

import { useMemo, useState } from "react";
import { requestPasswordResetAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button/Button";
import styles from "./auth-form.module.css";
import { Mail } from "lucide-react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const emailIsValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [email]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setMessage("");

    const result = await requestPasswordResetAction(email);

    if (result.success) {
      setMessage(result.message || "If an account exists, we sent a password reset link.");
    } else {
      setError(result.error || "Failed to request password reset");
    }

    setIsSubmitting(false);
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.authCard}>
        <div className={styles.header}>
          <h2 className={styles.title}>Forgot Password</h2>
          <div className={styles.titleUnderline} />
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}
        {message && <p className={styles.successMessage}>{message}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} size={20} />
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="plain"
            className={styles.submitButton}
            disabled={isSubmitting || !emailIsValid}
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>

          <div className={styles.footer}>
            <span>Remember your password?</span>
            <Button href="/login" variant="plain" className={styles.switchLink}>
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
