"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth/AuthProvider';
import { sendContactEmail } from '@/lib/actions/contact';
import { Button } from '@/components/ui/button/Button';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import styles from './contact-form.module.css';

import { User as UserIcon, Mail, MessageSquare, ArrowRight } from 'lucide-react';

function ContactFormInner() {
  const { user } = useAuth();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!executeRecaptcha) {
      setError('reCAPTCHA is not loaded yet');
      setIsSubmitting(false);
      return;
    }

    try {
      const token = await executeRecaptcha('contact_submit');

      const result = await sendContactEmail(
        formData.name,
        formData.email,
        formData.message,
        token
      );

      if (result.success) {
        setFormStatus('Thank you! We will get back to you soon...');
        setFormData({ name: user?.name || '', email: user?.email || '', message: '' });
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

  const formFields = [
    { name: 'name', type: 'text', label: 'Name', placeholder: 'Your name', icon: <UserIcon size={20} />, isValid: formData.name.length >= 2, readOnly: !!user },
    { name: 'email', type: 'email', label: 'Email', placeholder: 'Your email', icon: <Mail size={20} />, isValid: emailIsValid, readOnly: !!user },
    { name: 'message', type: 'textarea', label: 'Message', placeholder: 'Write your message here...', icon: <MessageSquare size={20} />, isValid: formData.message.length >= 10, readOnly: false },
  ];

  return (
    <div className={styles.formWrapper}>
      <h3 className={styles.formTitle}>Reach Out</h3>
      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.contactForm}>
        {formFields.map((field) => (
          <div key={field.name} className={styles.formGroup}>
            <label htmlFor={field.name}>{field.label}</label>
            <div className={styles.inputWrapper}>
              <div className={styles.inputIcon}>{field.icon}</div>
              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleInputChange}
                  required
                  placeholder={field.placeholder}
                  rows={3}
                />
              ) : (
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleInputChange}
                  required
                  placeholder={field.placeholder}
                  readOnly={field.readOnly}
                />
              )}
            </div>
          </div>
        ))}

        <Button
          type="submit"
          variant="plain"
          className={styles.sendBtn}
          disabled={isSubmitting || !isFormValid}
          iconRight={<ArrowRight size={20} />}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>

        {formStatus && <div className={styles.formStatus}>{formStatus}</div>}
      </form>
    </div>
  );
}

export default function ContactForm() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  return (
    <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
      <ContactFormInner />
    </GoogleReCaptchaProvider>
  );
}
