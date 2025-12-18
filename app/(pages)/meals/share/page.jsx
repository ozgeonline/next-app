"use client";

import { useAuth } from '@/context/auth/AuthProvider';
import styles from './page.module.css';
import Link from 'next/link';
import ShareMealForm from '@/components/meals/share-meal/share-meal-form';

export const dynamic = 'force-dynamic';

export default function ShareMealPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div>
        <p className='loading'>Loading...</p>
      </div>
    );
  } else if (!user && !loading) {
    return (
      <div className="non-user-message">
        <p>
          You must be logged in to share a meal.
        </p>
        <Link href="/login" className="button-gold-blue">
          Login
        </Link>
      </div>
    );
  }


  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>
          Share your <span className="highlight-gradient-text">favorite meal</span>
        </h1>
        <p>Or any other meal you feel needs sharing!</p>
      </header>
      <main className={styles.main}>
        <ShareMealForm user={user} />
      </main>
    </div >
  );
}