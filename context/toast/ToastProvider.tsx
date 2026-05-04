"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { CheckCircle2, Info, TriangleAlert, X, XCircle } from "lucide-react";
import styles from "./toast.module.css";

type ToastType = "success" | "error" | "info" | "warning";

type Toast = {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
};

type ToastInput = Omit<Toast, "id" | "type">;

type ToastContextValue = {
  toast: {
    success: (message: string, options?: Omit<ToastInput, "message">) => void;
    error: (message: string, options?: Omit<ToastInput, "message">) => void;
    info: (message: string, options?: Omit<ToastInput, "message">) => void;
    warning: (message: string, options?: Omit<ToastInput, "message">) => void;
  };
};

const TOAST_LIMIT = 3;
const DEFAULT_DURATION = 4000;

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

function createToastId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getToastIcon(type: ToastType) {
  if (type === "success") return <CheckCircle2 size={18} />;
  if (type === "error") return <XCircle size={18} />;
  if (type === "warning") return <TriangleAlert size={18} />;
  return <Info size={18} />;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toastItem) => toastItem.id !== id));
  }, []);

  const showToast = useCallback((type: ToastType, message: string, options?: Omit<ToastInput, "message">) => {
    const id = createToastId();
    const nextToast: Toast = {
      id,
      type,
      message,
      title: options?.title,
      duration: options?.duration ?? DEFAULT_DURATION,
    };

    setToasts((current) => [nextToast, ...current].slice(0, TOAST_LIMIT));

    window.setTimeout(() => {
      removeToast(id);
    }, nextToast.duration);
  }, [removeToast]);

  const value = useMemo<ToastContextValue>(() => ({
    toast: {
      success: (message, options) => showToast("success", message, options),
      error: (message, options) => showToast("error", message, options),
      info: (message, options) => showToast("info", message, options),
      warning: (message, options) => showToast("warning", message, options),
    },
  }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.viewport} aria-live="polite" aria-label="Notifications">
        {toasts.map((toastItem) => (
          <div
            key={toastItem.id}
            className={`${styles.toast} ${styles[toastItem.type]}`}
            role={toastItem.type === "error" ? "alert" : "status"}
          >
            <div className={styles.icon}>{getToastIcon(toastItem.type)}</div>
            <div className={styles.content}>
              {toastItem.title && <h3>{toastItem.title}</h3>}
              <p>{toastItem.message}</p>
            </div>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => removeToast(toastItem.id)}
              aria-label="Close notification"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
