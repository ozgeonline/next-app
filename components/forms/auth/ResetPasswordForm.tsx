"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { resetPasswordAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button/Button";
import styles from "./auth-form.module.css";
import { Eye, EyeOff, Lock } from "lucide-react";

type ResetPasswordFormProps = {
  token?: string;
};

export default function ResetPasswordForm({ token = "" }: ResetPasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const passwordIsValid = useMemo(() => password.length >= 6, [password]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    setMessage("");

    const result = await resetPasswordAction(token, password);

    if (result.success) {
      setMessage(result.message || "Password updated successfully.");
      setPassword("");
      setTimeout(() => router.push("/login"), 1600);
    } else {
      setError(result.error || "Failed to reset password");
    }

    setIsSubmitting(false);
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.authCard}>
        <div className={styles.header}>
          <h2 className={styles.title}>Reset Password</h2>
          <div className={styles.titleUnderline} />
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}
        {message && <p className={styles.successMessage}>{message}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="password">New Password</label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} size={20} />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter new password"
                autoComplete="new-password"
                required
              />
              <Button
                type="button"
                variant="plain"
                className={styles.togglePassword}
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            variant="plain"
            className={styles.submitButton}
            disabled={isSubmitting || !passwordIsValid || !token}
          >
            {isSubmitting ? "Saving..." : "Reset Password"}
          </Button>

          <div className={styles.footer}>
            <span>Back to</span>
            <Button href="/login" variant="plain" className={styles.switchLink}>
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
