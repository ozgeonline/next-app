import styles from "./page.module.css";
export default function Loading() {
  return (
      <div className={`${styles.containerWrapper + ' ' + styles.gradientBackground}`}>
        <h3 className={styles.loading}>Loading...</h3>
      </div>
    );
}