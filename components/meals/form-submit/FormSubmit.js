// Form submit button:
// displays a submit button that disables itself while the form is being submitted.

'use client';

import { useFormStatus } from 'react-dom';
import styles from './form-submit.module.css';

export default function MealsFormSubmit() {
  const { pending } = useFormStatus();

  return (
    <button 
      type='submit' 
      disabled={pending} 
      className={`accent-link-button ${styles.submitButton}`}
    >
      {pending ? 'submitting...' : 'share'}
    </button>
  );
}