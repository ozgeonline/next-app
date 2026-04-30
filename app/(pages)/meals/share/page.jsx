import Image from "next/image";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import ShareMealForm from "@/components/meals/share-meal/ShareMealForm";
import { Button } from "@/components/ui/button/Button";
import styles from "./page.module.css";

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
        <p>You must be logged in to share a meal.</p>
        <Button href="/login" variant="primary" style={{ maxWidth: "5rem" }}>
          Login
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.layoutWrapper}>
        <div className={styles.leftColumn}>
          <header className={styles.header}>
            <h1>
              Share your <br />
              <span className="highlight-text">favorite meal</span>
            </h1>
            <p className={styles.description}>
              Inspire others by sharing your recipe.<br />
              It's simple, delicious and made with love!
            </p>
          </header>

          <div className={styles.imageContainer}>
            <Image
              src="https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFDlLh8Vyqvj7qBtEJaeIm4Mu1klYRxAVTK8FdH"
              alt="Delicious salmon salad"
              fill
              className={styles.archedImage}
            />
          </div>
        </div>

        <main className={styles.main}>
          <ShareMealForm user={{ name: user.name, email: user.email }} />
        </main>
      </div>
    </div>
  );
}
