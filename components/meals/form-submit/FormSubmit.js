// Form submit button:
// displays a submit button that disables itself while the form is being submitted.

'use client';

import { useFormStatus } from 'react-dom';
import { Send } from 'lucide-react';
import styles from './form-submit.module.css';

export default function MealsFormSubmit() {
  const { pending } = useFormStatus();

  return (
    <button 
      type='submit' 
      disabled={pending} 
      className={styles.submitButton}
    >
      {pending ? (
        'Submitting...'
      ) : (
        <>
          <Send size={16} className={styles.icon} />
          Share Recipe
        </>
      )}
    </button>
  );
}