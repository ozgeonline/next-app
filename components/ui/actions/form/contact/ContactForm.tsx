"use client";

import { useCallback, useMemo, useState } from 'react';
import styles from './contact-form.module.css';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState('');
  const [isTouched, setIsTouched] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormStatus('Thank you! We will get back to you soon...');
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setFormStatus(''), 5000);
    setIsTouched(false);
  };

  const handleInputBlur = useCallback(() => {
    setIsTouched(true);
  }, []);

  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const emailIsValid = useMemo(() => validateEmail(formData.email), [formData.email, validateEmail]);

  return (
    <div className={styles.formWrapper}>
      <h3>Reach Out</h3>
      <form onSubmit={handleSubmit} className={styles.contactForm}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="Your Name"
            required
            className={`
              ${formData.name ? `${styles.validValueColor}` 
                : !formData.name && isTouched ? `${styles.invalidValueColor}` 
                : `${styles.defaultValueColor}`
              }
            `}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            required
            placeholder="Your Email"
            className={`
              ${(formData.name && emailIsValid) ? `${styles.validValueColor}` 
              : (!formData.name || !emailIsValid) && isTouched ? `${styles.invalidValueColor}` 
              : `${styles.defaultValueColor}`
            }
            `}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className={styles.defaultValueColor}
            required
            placeholder="Your Message..."
            rows={4}
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Send Message
        </button>

        {formStatus && 
          <p className={styles.formStatus}>
            {formStatus}
          </p>
        }
      </form>
    </div>
  );
}