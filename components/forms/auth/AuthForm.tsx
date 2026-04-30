'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/auth/AuthProvider";
import { loginAction, signupAction } from "@/lib/actions/auth";
import Link from 'next/link';
import { Button } from '@/components/ui/button/Button';
import styles from "./auth-form.module.css";
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const { loading, mutateUser } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const result = formType === "login"
        ? await loginAction(formData.email, formData.password, rememberMe)
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

  const formFields = [
    {
      name: "name",
      type: "text",
      placeholder: "Enter your name",
      label: "Name",
      condition: formType === "signup",
      isValid: formData.name.length >= 2,
      icon: User,
    },
    {
      name: "email",
      type: "email",
      placeholder: "Enter your email",
      label: "Email",
      condition: true,
      isValid: emailIsValid,
      icon: Mail,
    },
    {
      name: "password",
      type: showPassword ? "text" : "password",
      placeholder: "Enter your password",
      label: "Password",
      condition: true,
      isValid: formData.password.length >= 6,
      autoComplete: formType === "signup" ? "new-password" : "current-password",
      icon: Lock,
      isPassword: true,
    }
  ];

  return (
    <div className={styles.formContainer}>
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <span>Loading...</span>
        </div>
      ) : (
        <div className={styles.authCard}>
          <div className={styles.header}>
            <h2 className={styles.title}>{formType === "login" ? "Login" : "Sign Up"}</h2>
            <div className={styles.titleUnderline}></div>
          </div>

          {error && <p className={styles.errorMessage}>{error}</p>}

          <form onSubmit={handleSubmit} className={styles.form}>
            {formFields.map((field) => (
              field.condition && (
                <div key={field.name} className={styles.inputGroup}>
                  <label htmlFor={field.name}>{field.label}</label>
                  <div className={styles.inputWrapper}>
                    <field.icon className={styles.inputIcon} size={20} />
                    <input
                      name={field.name}
                      type={field.type}
                      id={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.name as keyof typeof formData]}
                      autoComplete={field.autoComplete}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      onBlur={() => setTouchedFields(prev => ({ ...prev, [field.name]: true }))}
                      required
                      className={touchedFields[field.name] && !field.isValid ? styles.invalidInput : ""}
                    />
                    {field.isPassword && (
                      <Button
                        type="button"
                        variant="plain"
                        className={styles.togglePassword}
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </Button>
                    )}
                  </div>
                </div>
              )
            ))}

            {formType === "login" && (
              <div className={styles.formOptions}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <Link href="/forgot-password" className={styles.forgotLink}>
                  Forgot password?
                </Link>
              </div>
            )}

            <Button
              type="submit"
              variant="plain"
              className={styles.submitButton}
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting
                ? "Processing..."
                : formType === "login"
                  ? "Login"
                  : "Create Account"
              }
            </Button>

            <div className={styles.divider}>
              <div className={styles.dividerLine}></div>
              <span className={styles.dividerText}>or</span>
              <div className={styles.dividerLine}></div>
            </div>

            <div className={styles.footer}>
              <span>
                {formType === "login"
                  ? "Don't have an account?"
                  : "Already have an account?"
                }
              </span>
              <Link
                href={referencePath === "signup" ? "/signup" : "/login"}
                className={styles.switchLink}
              >
                {referencePath === "signup" ? "Sign up" : "Login"}
              </Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
