'use client';

import { useFormStatus } from 'react-dom';
import { useAuth } from "@/context/auth/AuthProvider";
import styles from './meals-form-submit.module.css';

export default function MealsFormSubmit() {
  const { pending } = useFormStatus();
  const { isAuthenticated } = useAuth();

  return (
    <button 
      type='submit' 
      disabled={pending || !isAuthenticated} 
      className={`accent-link-button ${styles.submitButton}`}
    >
      {pending ? 'submitting...' : 'share'}
    </button>
  );
}