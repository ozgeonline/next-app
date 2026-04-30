import Image from "next/image";
import AnimatedOnScroll from "@/components/ui/animation/animated-scroll/AnimatedOnScroll";
import { items } from "@/components/sections/feature-showcase/sections-items";
import styles from "./animated-sections.module.css";

const BUBBLE_COUNT = 5;

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export default function FeatureShowcase() {
  return (
    <>
      {items.map(({ title, description, images, reverse, label, icon: Icon }) => {
        return (
          <section key={title} className={styles.section}>
            <div className={cx(styles.featureLayout, reverse && styles.reversed)}>
              {images && (
                <AnimatedOnScroll
                  animationClass={styles.animateInView}
                  className={styles.imageStack}
                >
                  {Icon && (
                    <div className={cx(styles.iconBadge, reverse ? styles.badgeRight : styles.badgeLeft)}>
                      <Icon size={20} />
                    </div>
                  )}
                  <Image
                    className={styles.primaryImage}
                    src={images.src1}
                    alt={images.alt}
                    sizes="100%"
                    quality={90}
                    width={50}
                    height={150}
                  />
                  <Image
                    className={styles.secondaryImage}
                    src={images.src2}
                    alt={images.alt}
                    sizes="100%"
                    quality={90}
                    width={50}
                    height={150}
                  />
                  <div className={styles.bubbles}>
                    {Array.from({ length: BUBBLE_COUNT }, (_, index) => (
                      <div
                        key={index}
                        className={cx(styles.bubble, styles[`bubble${index + 1}`])}
                      />
                    ))}
                  </div>
                </AnimatedOnScroll>
              )}
              <div className={styles.content}>
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
          </section>
        );
      })}
    </>
  )
}
