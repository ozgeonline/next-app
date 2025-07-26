import AnimatedOnScroll from "@/components/providers/animation/AnimatedOnScroll";
import Image from "next/image";
import styles from "./animated-sections.module.css";

interface SectionProps {
  title: string;
  description: string;
  images?: {
    src1: string;
    src2: string;
    alt: string;
  };
  reverse?: boolean;
}

export default function AnimatedSections({
  title,
  description,
  images,
  reverse
}: SectionProps) {
  return (
     <div className={styles.containerWrapper}>
        <div className={styles.heroDefault}>
          <h2>{title}</h2>
        </div>
        <div className={`
          ${styles.definitionDefault} 
          ${reverse && styles.reverseDefinition} 
          ${reverse && styles.reverseRowDefinition} 
          `}>
          <AnimatedOnScroll
            animationClass={styles.animateinView}
            className={`
              ${styles.definitionImage} 
              ${styles.imageVisible}
            `}
          >
            <Image
              className={styles.imageFirst}
              src={images.src1}
              alt={images.alt}
              loading="eager"
              quality={100}
              sizes="100%"
              width={50} 
              height={150}
            />
            <Image
              className={styles.imageSecond} 
              src={images.src2}
              alt={images.alt}
              loading="eager" 
              quality={100} 
              sizes='100%' 
              width={50} 
              height={150}
            />
            <span className={styles.colorsBackground} />
          </AnimatedOnScroll>
          <p>{description}</p>
        </div>
      </div>
  )
}