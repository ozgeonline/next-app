"use client";

import { useCallback, useMemo, useState } from 'react';
import { sendContactEmail } from '@/lib/actions/contact';
import styles from './contact-form.module.css';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [formStatus, setFormStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const result = await sendContactEmail(formData.name, formData.email, formData.message);

      if (result.success) {
        setFormStatus('Thank you! We will get back to you soon...');
        setFormData({ name: '', email: '', message: '' });
        setTouchedFields({});
        setTimeout(() => setFormStatus(''), 5000);
      } else {
        setError(result.error || 'Failed to send message');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const emailIsValid = useMemo(() => validateEmail(formData.email), [formData.email, validateEmail]);

  const isFormValid = formData.name.length >= 2 && emailIsValid && formData.message.length >= 10;

  const getInputClassName = (fieldName: string, isValid: boolean, value: string) => {
    if (value && isValid) return styles.validValueColor;
    if ((!value || !isValid) && touchedFields[fieldName]) return styles.invalidValueColor;
    return styles.defaultValueColor;
  };

  const formFields = [
    { name: 'name', type: 'text', label: 'Name', placeholder: 'Your Name', isValid: formData.name.length >= 2 },
    { name: 'email', type: 'email', label: 'Email', placeholder: 'Your Email', isValid: emailIsValid },
    { name: 'message', type: 'textarea', label: 'Message', placeholder: 'Your Message...', isValid: formData.message.length >= 10 },
  ];

  return (
    <div className={styles.formWrapper}>
      <h3>Reach Out</h3>
      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.contactForm}>
        {formFields.map((field) => (
          <div key={field.name} className={styles.formGroup}>
            <label htmlFor={field.name}>{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleInputChange}
                onBlur={() => setTouchedFields(prev => ({ ...prev, [field.name]: true }))}
                className={getInputClassName(field.name, field.isValid, formData[field.name as keyof typeof formData])}
                required
                placeholder={field.placeholder}
                rows={4}
              />
            ) : (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name as keyof typeof formData]}
                onChange={handleInputChange}
                onBlur={() => setTouchedFields(prev => ({ ...prev, [field.name]: true }))}
                className={getInputClassName(field.name, field.isValid, formData[field.name as keyof typeof formData])}
                required
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting || !isFormValid}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>

        {formStatus && <p className={styles.formStatus}>{formStatus}</p>}
      </form>
    </div>
  );
}