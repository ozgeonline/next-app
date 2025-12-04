'use client';

import { useFormStatus } from 'react-dom';
import { useAuth } from "@/context/auth/AuthProvider";

export default function MealsFormSubmit() {
  const { pending } = useFormStatus();
  const { isAuthenticated } = useAuth();

  return (
    <button type='submit' disabled={pending || !isAuthenticated}>
      {pending ? 'Submitting...' : 'Share Meal'}
    </button>
  );
}