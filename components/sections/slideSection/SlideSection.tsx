import AnimatedOnScroll from "@/components/providers/animation/AnimatedOnScroll";
import Link from "next/link";
import { removeBGimages } from '@/components/slides/slideshow-items';
import ImageSlideshow from "@/components/slides/slideShow/Image-slideshow";
import InfiniteSlideLoop from "@/components/slides/loopSlides/InfiniteSlideLoop";
import styles from "./slide-section.module.css";

interface SlideSectionProps {
  isCommunityInfoVisible: boolean;
}

export default function SlideSection({ isCommunityInfoVisible }: SlideSectionProps){
  return (
    <div className={styles.slideSection + ' ' + "mainBackground"}>
      <div className={styles.animateContent}>
        <div className={styles.slideShowWrapper}>
          <ImageSlideshow />
        </div>
        <AnimatedOnScroll
          className={styles.containerWrapper}
          animationClass={styles.animateInRight}
        >
          <div className={styles.hero}>
            <h1>Taste & share food from all over the world.</h1>
          </div>
          <div className={styles.cta}>
            <Link href="/community">Join the Community</Link>
            <Link href="/meals">Explore Meals</Link>
          </div>
        </AnimatedOnScroll>
      </div>
      <div 
        className={`
          ${styles.infiniteSlideLoopWrapper} 
          ${isCommunityInfoVisible ? styles.opacity0 : styles.opacity1}
        `}
      >
        <InfiniteSlideLoop images={removeBGimages} className={styles.itemWrapper}/>
      </div>
    </div>
  )
}