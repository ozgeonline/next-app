import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './menuHero.module.css';

export default function MenuHeroBanner({
  srcImage,
  title,
  description,
  label,
  icon: Icon,
  highlightWord
}) {

  const renderTitle = () => {
    if (!highlightWord) return title;
    const parts = title.split(highlightWord);
    if (parts.length < 2) return title;

    return (
      <>
        {parts[0]}
        <span className={styles.highlight}>{highlightWord}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundWrapper}>
        <Image
          src={srcImage}
          alt={title || "Menu Hero"}
          fill
          priority
          className={styles.backgroundImage}
          sizes="100vw"
        />
        <div className={styles.gradientOverlay} />
      </div>

      <div className={styles.content}>
        {label && (
          <div className={styles.labelWrapper}>
            {Icon && (
              <div className={styles.iconCircle}>
                <Icon size={16} />
              </div>
            )}
            <span className={styles.label}>{label}</span>
          </div>
        )}

        <h1 className={styles.title}>{renderTitle()}</h1>
        <p className={styles.description}>{description}</p>

        <Link href="/menu/desserts" className={styles.exploreButton}>
          Explore Our Menu
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
