import AnimatedOnScroll from '@/components/providers/animation/AnimatedOnScroll';
import Image from 'next/image';
import styles from "./positioned-image.module.css";

interface MainContentProps {
  isCommunityInfoVisible: boolean;
}

export default function PositionedImage({ isCommunityInfoVisible }: MainContentProps) {
  return (
    <div className={styles.imgWrapper}>
      <div
        className={`
          ${isCommunityInfoVisible ? styles.fixedImage : styles.relativeImage} 
          ${styles.defaultImage}
        `}
      >
        <Image
          src="https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFDuHNl2syxsRZPv8rXjBlDd3LWgbnNHmSpeQwJ"
          alt="Cafe Background"
          fill
          loading="eager"
          quality={100}
          sizes="100%"
        />
        <div className={styles.imageShadow}></div>
      </div>

      {/* Focus Section */}
      {!isCommunityInfoVisible && (
        <AnimatedOnScroll
          className={styles.imageContent}
          animationClass={styles.animateInRight}
        >
          <h1>Nourish your body, energize your mind</h1>
          <h2>Brew Focus. Eat Clean. Change Everything.</h2>
          <p>
            Support your mental clarity with coffee and your physical health with nutritious meals 
            — small habits that lead to lasting change.
          </p>
        </AnimatedOnScroll>
      )}
    </div>
  );
}