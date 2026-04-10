// Share meal form component:
// renders the meal sharing form and delegates submission to the "shareMeal" server action.

"use client";

import { useActionState } from 'react';
import shareMeal from '@/app/(pages)/meals/share/actions/share-actions';
import ImagePicker from '@/components/meals/image-picker/ImagePicker';
import MealsFormSubmit from '@/components/meals/form-submit/FormSubmit';
import FormInput from '@/components/ui/form/field';
import styles from './share-meal.module.css';

export default function ShareMealForm({ user }) {
  const [state, formAction] = useActionState(shareMeal, { message: null });

  return (
    <form className={styles.form} action={formAction}>
      <div className={styles.row}>
        <FormInput
          label="Your name"
          id="name"
          defaultValue={user?.name || ""}
          readOnly
        />
        <FormInput
          label="Your email"
          id="email"
          type="email"
          defaultValue={user?.email || ""}
          readOnly
        />
      </div>
      <FormInput label="Title" id="title" name="title" required />
      <FormInput label="Short Summary" id="summary" name="summary" required />
      <FormInput label="Instructions" id="instructions" name="instructions" rows="10" required />

      <ImagePicker label="Your Meal Image" name="image" />

      {state?.message && <p className="error">{state.message}</p>}

      <div className={styles.actions}>
        <MealsFormSubmit />
      </div>
    </form>
  );
}
