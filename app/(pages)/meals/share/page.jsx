import Link from 'next/link';
import { getUserFromCookies } from '@/lib/getUserFromCookies';
import ShareMealForm from '@/components/meals/share-meal/ShareMealForm';
import styles from './page.module.css';

export const metadata = {
  title: "Share a Meal | TasteShare",
  description: "Share your favorite recipe with the TasteShare community. Upload your meal and inspire others.",
  keywords: ["share recipe", "upload meal", "TasteShare", "food community"],
};

export default async function ShareMealPage() {
  const user = await getUserFromCookies();

  if (!user) {
    return (
      <div className="non-user-message">
        <p>
          You must be logged in to share a meal.
        </p>
        <Link href="/login" className="accent-link-button">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>
          Share your <span className="highlight-text">favorite meal</span>
        </h1>
        <p>Or any other meal you feel needs sharing!</p>
        <p className={styles.instructionsNote}>(Use a new line for each step.)</p>
      </header>
      <main className={styles.main}>
        <ShareMealForm user={{ name: user.name, email: user.email }} />
      </main>
    </div>
  );
}