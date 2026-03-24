import ScrollToSection from "@/components/ui/animation/trigger-scroll/ScrollToSection";
import AnimatedOnScroll from "@/components/ui/animation/animated-scroll/AnimatedOnScroll";
import InfiniteSlideLoop from "@/components/ui/slides/loop-slides/InfiniteSlideLoop";
import { infoImages } from "@/components/ui/slides/slideshow-items";
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
}: LoopSlideSectionProps) {
  return (
    <ScrollToSection
      className={styles.sectionWrapper}
      isVisible={isLoopSlideVisible}
      setIsVisible={setIsLoopSlideVisible}
    >
      <AnimatedOnScroll
        className={styles.contentContainer}
        animationClass={styles.animateInRight}
        onVisibilityChange={setIsLoopSlideVisible}
      >
        {/* Section Title Container */}
        <div className={`${styles.sectionTitle} ${isCommunityInfoVisible ? styles.sectionTitleActive : ''}`}>
          <h2 className={styles.titleText}>
            Brew Focus. Eat Clean. Change Everything.
          </h2>
        </div>

        {/* Multi-Styled Infinite Slide Loop */}
        <InfiniteSlideLoop
          images={infoImages}
          className={`${styles.sliderCard} ${isCommunityInfoVisible ? styles.sliderCardActive : ''}`}
          itemsWrapperClassName={isCommunityInfoVisible ? styles.itemsWrapperVisible : styles.itemsWrapperHidden}
          slideTitleStyles={`${styles.itemTitle} ${isCommunityInfoVisible ? styles.itemTitleActive : ''}`}
        />
      </AnimatedOnScroll>
    </ScrollToSection>
  );
}