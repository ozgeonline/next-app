import styles from "./waves-background.module.css";

export default function WavesBackground() {
  return (
    <div className={styles.wavesOverlay}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={styles.wavesSvg}>
        <g className={styles.waveGroup1}>
          {Array.from({ length: 25 }).map((_, i) => (
            <path key={`wave1-${i}`} d={`M -20 ${35 + i * 0.4} C ${30 + i * 0.5} ${15 + i * 0.8}, ${60 - i * 0.5} ${85 - i * 0.8}, 120 ${45 + i * 0.4}`} />
          ))}
        </g>
        <g className={styles.waveGroup2}>
          {Array.from({ length: 25 }).map((_, i) => (
            <path key={`wave2-${i}`} d={`M -20 ${55 + i * 0.4} C ${40 - i * 0.5} ${95 - i * 0.8}, ${70 + i * 0.5} ${35 + i * 0.8}, 120 ${65 + i * 0.4}`} />
          ))}
        </g>
        <g className={styles.waveGroup3}>
          {Array.from({ length: 25 }).map((_, i) => (
            <path key={`wave3-${i}`} d={`M -20 ${45 + i * 0.4} C ${20 + i * 0.5} ${75 + i * 0.5}, ${80 - i * 0.5} ${15 + i * 0.5}, 120 ${55 + i * 0.4}`} />
          ))}
        </g>
      </svg>
    </div>
  );
}
