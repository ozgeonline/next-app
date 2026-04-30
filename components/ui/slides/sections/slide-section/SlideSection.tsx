import AnimatedOnScroll from "@/components/ui/animation/animated-scroll/AnimatedOnScroll";
import { removeBGimages } from '@/components/ui/slides/slideshow-items';
import ImageSlideshow from "@/components/ui/slides/image-slideshow/ImageSlideshow";
import InfiniteSlideLoop from "@/components/ui/slides/loop-slides/InfiniteSlideLoop";
import styles from "./slide-section.module.css";
import WavesBackground from "@/components/ui/backgrounds/wavesBackground/WavesBackground";
import CTA from "@/components/sections/cta/CTA";

export default function SlideSection() {
  return (
    <div className={`${styles.slideSection} mainBackground`}>
      <WavesBackground />

      <div className={styles.content}>
        <div className={styles.slideshow}>
          <ImageSlideshow />
        </div>
        <AnimatedOnScroll
          className={styles.textContent}
          animationClass={styles.animateInRight}
        >
          <div className="highlight-text-wrapper">
            <h1>Taste & share food from all over <span className="highlight-text">the world.</span></h1>
          </div>
          <p className={styles.description}>
            Join thousands of food lovers around the world and discover new dishes, share recipes, and connect with people who share your passion for food.
          </p>
          <CTA
            primaryButton={{ label: 'Join the Community', href: '/community' }}
            secondaryButton={{ label: 'Explore Meals', href: '/meals', chevronCount: 3 }}
          />
        </AnimatedOnScroll>
      </div>
      <div className={styles.infiniteSlideLoopWrapper}>
        <InfiniteSlideLoop images={removeBGimages} itemClassName={styles.itemWrapper} />
      </div>
    </div>
  )
}
