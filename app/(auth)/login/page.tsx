'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from "./login.module.css";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(true); 
  const router = useRouter();

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/reservation');
    } else {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      router.push('/reservation');
    } else {
      alert(data.error || 'Login failed');
    }
  };

  if (isLoading) return null; 

  return (
    <div className={styles.containerWrapper}> 
      <div className={styles.containerTopNavbar} />
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input 
          name="email" 
          type="email"
          value={formData.email}
          placeholder="Email" 
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
