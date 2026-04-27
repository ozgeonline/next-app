import Image from "next/image";
import AnimatedOnScroll from "@/components/ui/animation/animated-scroll/AnimatedOnScroll";
import { items } from '@/components/sections/feature-showcase/sections-items';
import styles from "./animated-sections.module.css";

export default function AnimatedSections() {
  return (
    <>
      {items.map((item, index) => {
        const sectionData = item.savor || item.desserts || item.energy;
        if (!sectionData) return null;
        const { title, description, images, reverse, label, icon: Icon } = sectionData;

        return (
          <div key={index} className={styles.containerWrapper}>
            <div className={`
              ${styles.definitionDefault} 
              ${reverse ? `${styles.reverseDefinition} ${styles.reverseRowDefinition}` : ""}`}
            >
              {images && (
                <AnimatedOnScroll
                  animationClass={styles.animateinView}
                  className={`${styles.definitionImage} ${styles.imageVisible}`}
                >
                  {/* Decorative Elements */}
                  <div className={`${styles.dotPattern} ${reverse ? styles.dotPatternRight : styles.dotPatternLeft}`} />
                  <div className={`${styles.iconRing} ${reverse ? styles.iconRingRight : styles.iconRingLeft}`} />
                  
                  {/* Icon Badge */}
                  {Icon && (
                    <div className={`${styles.iconBadge} ${reverse ? styles.badgeRight : styles.badgeLeft}`}>
                      <Icon size={20} />
                    </div>
                  )}
                  <Image
                    className={styles.imageFirst}
                    src={images.src1}
                    alt={images.alt}
                    sizes="100%"
                    quality={90}
                    width={50}
                    height={150}
                  />
                  <Image
                    className={styles.imageSecond}
                    src={images.src2}
                    alt={images.alt}
                    sizes="100%"
                    quality={90}
                    width={50}
                    height={150}
                  />
                  <div className={styles.bubblesContainer}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <div key={i} className={`${styles.bubble} ${styles[`bubble${i + 1}`]}`} />
                    ))}
                  </div>
                </AnimatedOnScroll>
              )}
              <div className={styles.textContainer}>
                {/* Subtitle Label with decorative lines */}
                {label && (
                  <span className={styles.sectionLabel}>
                    <span className={styles.labelLine} />
                    {label}
                    <span className={styles.labelLine} />
                  </span>
                )}
                <h2 className="highlight-text">{title}</h2>
                <div className={styles.titleSeparator} />
                <p>{description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </>
  )
}