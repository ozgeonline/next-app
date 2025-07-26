import ScrollToSection from "@/components/providers/ScrollToSection";
import AnimatedOnScroll from "@/components/providers/animation/AnimatedOnScroll";
import InfiniteSlideLoop from "../../slides/loopSlides/InfiniteSlideLoop";
import { infoImages } from "../../slides/slideshow-items";
import styles from "./loop-slide-section.module.css";

interface LoopSlideSectionProps {
  isLoopSlideVisible: boolean;
  setIsLoopSlideVisible: (visible: boolean) => void;
  isCommunityInfoVisible: boolean;
}

export default function LoopSlideSection({
  isLoopSlideVisible,
  setIsLoopSlideVisible,
  isCommunityInfoVisible,
}: LoopSlideSectionProps)  {
  return (
    <ScrollToSection 
      className={styles.loopSlideSection} 
      isVisible={isLoopSlideVisible} 
      setIsVisible={setIsLoopSlideVisible}
    >
      <AnimatedOnScroll
        className={styles.containerWrapper + ' ' + styles.defaultPadding}
        animationClass={styles.animateInRight}
        onVisibilityChange={isVisible => setIsLoopSlideVisible(isVisible)}
      >
        <div className={isCommunityInfoVisible ? styles.hero : styles.heroDefault}>
          <h2>
            Brew Focus. Eat Clean. Change Everything.
          </h2>
        </div>
        <InfiniteSlideLoop
          images={infoImages}
          className={isCommunityInfoVisible ? styles.infiniteSlideLoop : styles.infiniteSlideLoopDefault}
          slideTitleStyles={isCommunityInfoVisible ? styles.slideTitle : styles.slideTitleDefault}
        />
      </AnimatedOnScroll>
    </ScrollToSection>
  )
}