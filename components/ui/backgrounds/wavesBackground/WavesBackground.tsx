import styles from "./waves-background.module.css";

export default function WavesBackground() {
  return (
    <div className={styles.container}>
      <div className={styles.watermark1}>TASTE</div>
      <div className={styles.watermark2}>EXPERIENCE</div>
      <div className={styles.watermark3}>CRAFT</div>
      <div className={styles.watermark4}>SAVOR</div>
    </div>
  );
}
