import Image from "next/image";
import AnimatedOnScroll from "@/components/ui/animation/animated-scroll/AnimatedOnScroll";
import { items } from '@/components/sections/animated_sections/sections-items';
import styles from "./animated-sections.module.css";

export default function AnimatedSections() {
  return (
    <>
      {items.map((item, index) => {
        const sectionData = item.savor || item.desserts || item.energy;
        if (!sectionData) return null;
        const { title, description, images, reverse } = sectionData;

        return (
          <div key={index} className={styles.containerWrapper}>
            <div className={styles.heroDefault}>
              <h2 className="highlight-gradient-text">{title}</h2>
            </div>

            <div className={`${styles.definitionDefault} ${reverse ? `${styles.reverseDefinition} ${styles.reverseRowDefinition}` : ""}`}>
              {images && (
                <AnimatedOnScroll
                  animationClass={styles.animateinView}
                  className={`${styles.definitionImage} ${styles.imageVisible}`}
                >
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
                  <div className={styles.colorsBackground} />
                </AnimatedOnScroll>
              )}

              <p>{description}</p>
            </div>
          </div>
        );
      })}
    </>
  )
}