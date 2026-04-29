// Share meal form component:
// renders the meal sharing form and delegates submission to the "shareMeal" server action.

"use client";

import { useActionState } from 'react';
import Link from 'next/link';
import { User, FileText, List, ImageIcon, ArrowLeft } from 'lucide-react';
import shareMeal from '@/app/(pages)/meals/share/actions/share-actions';
import ImagePicker from '@/components/meals/image-picker/ImagePicker';
import MealsFormSubmit from '@/components/meals/form-submit/FormSubmit';
import FormInput from '@/components/ui/form/field';
import styles from './share-meal.module.css';

// Reusable structural component for form cards
function FormCard({ title, icon: Icon, children }) {
  return (
    <div className={styles.formSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.iconCircle}><Icon size={18} /></div>
        <h3>{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function ShareMealForm({ user }) {
  const [state, formAction] = useActionState(shareMeal, { message: null });

  return (
    <form className={styles.form} action={formAction}>

      {/* 1. Basic Information */}
      <FormCard title="1. Basic Information" icon={User}>
        <div className={styles.row}>
          {[
            { id: "name", label: "YOUR NAME", val: user?.name },
            { id: "email", label: "YOUR EMAIL", type: "email", val: user?.email }
          ].map(f => (
            <FormInput
              key={f.id}
              label={f.label}
              id={f.id}
              type={f.type}
              defaultValue={f.val || ""}
              readOnly
            />
          ))}
        </div>
        <FormInput
          label="TITLE OF YOUR RECIPE"
          id="title"
          name="title"
          required
          maxLength={25}
          placeholder="Enter a title for your recipe (max 25 characters)"
        />
      </FormCard>

      <div className={styles.middleRow}>
        {/* 2 & 3. Summary and Instructions */}
        {[
          {
            id: "summary",
            title: "2. Short Summary",
            icon: FileText,
            placeholder: "Write a short summary of your recipe\n(max 160 characters)",
            maxLength: 160
          },
          {
            id: "instructions",
            title: "3. Instructions",
            icon: List,
            placeholder: "Write the step-by-step instructions for your recipe"
          }
        ].map(field => (
          <FormCard key={field.id} title={field.title} icon={field.icon}>
            <FormInput
              label=""
              id={field.id}
              name={field.id}
              rows="4"
              required
              placeholder={field.placeholder}
              maxLength={field.maxLength}
            />
          </FormCard>
        ))}
      </div>

      {/* 4. Add a Photo */}
      <FormCard title="4. Add a Photo of Your Meal" icon={ImageIcon}>
        <ImagePicker name="image" />
      </FormCard>

      {state?.message && <p className="error">{state.message}</p>}

      <div className={styles.actionsRow}>
        <Link href="/meals" className={styles.backButton}>
          <ArrowLeft size={16} /> Back to meals
        </Link>
        <MealsFormSubmit />
      </div>
    </form>
  );
}
