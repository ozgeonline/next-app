import Image from 'next/image';

// import mealIcon from '@/public/cafe/coffee.webp';
// import communityIcon from '@/public/cafe/a.webp';
// import eventsIcon from '@/public/cafe/c.webp';
import styles from './page.module.css';
import Link from 'next/link';

export default function CommunityPage() {
  return (
    <div className={styles.container + ' ' + "mainBackground"}>
      {/* <div className={styles.containerTopNavbar} /> */}
      <header className={styles.header}>
        <h1>
          One shared passion: <span className={styles.highlight}>Food</span>
        </h1>
        <p>Join our community and share your favorite recipes!</p>
      </header>
      
      <main className={styles.main}>
        <div className={styles.meals}>
          <h2>Meals Shared</h2>
          <Link href="/meals">Browse Meals</Link>
        </div>

        <div className={styles.perks}>
          <h2>Community Perks</h2>
          <ul className={styles.perks}>
            <li>
              <p>Share & discover recipes</p>
            </li>
            <li>
              <p>Find new friends & like-minded people</p>
            </li>
            <li>
              <p>Participate in exclusive events</p>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}