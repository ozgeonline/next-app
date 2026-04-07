import AnimatedOnScroll from '@/components/ui/animation/animated-scroll/AnimatedOnScroll';
import Image from 'next/image';
import styles from "./positioned-image.module.css";

interface PositionedImageProps {
  isCommunityInfoVisible: boolean;
}

export default function PositionedImage({ isCommunityInfoVisible }: PositionedImageProps) {
  return (
    <div className={styles.imgWrapper}>
      <div className={`${isCommunityInfoVisible ? styles.fixedImage : styles.relativeImage} ${styles.defaultImage}`}>
        <div className={styles.darkPlaceholder}></div>
        <Image
          src="https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFDuHNl2syxsRZPv8rXjBlDd3LWgbnNHmSpeQwJ"
          alt="Cafe Background"
          fill
          priority
          quality={100}
          sizes="100vw"
        />
        <div className={styles.imageShadow}></div>
      </div>

      {/* Focus Section */}
      {!isCommunityInfoVisible && (
        <AnimatedOnScroll
          className={styles.imageContent}
          animationClass={styles.animateInRight}
        >
          <h1 className='highlight-text'>Nourish your body, energize your mind</h1>
          <h2>Brew Focus. Eat Clean. Change Everything.</h2>
        </AnimatedOnScroll>
      )}
    </div>
  );
}