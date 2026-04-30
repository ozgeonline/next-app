"use client";

import { useFormStatus } from "react-dom";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import styles from "./form-submit.module.css";

export default function MealsFormSubmit() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      variant="plain"
      className={styles.submitButton}
      iconLeft={!pending && <Send size={16} className={styles.icon} />}
    >
      {pending ? "Submitting..." : "Share Recipe"}
    </Button>
  );
}
