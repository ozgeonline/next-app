'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from "./signup.module.css";
export default function SignupPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/login');
    }
}, []);


  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (res.ok) {
      router.push('/login');
    } else {
      alert(data.error || 'Registration failed');
    }
  };

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.containerTopNavbar} />
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          placeholder="Name"
           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
           onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
