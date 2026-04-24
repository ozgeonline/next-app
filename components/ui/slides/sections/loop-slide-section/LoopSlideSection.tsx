import AnimatedOnScroll from "@/components/ui/animation/animated-scroll/AnimatedOnScroll";
import InfiniteSlideLoop from "@/components/ui/slides/loop-slides/InfiniteSlideLoop";
import { infoImages } from "@/components/ui/slides/slideshow-items";
import styles from "./loop-slide-section.module.css";
import OliveBranch from "@/components/ui/decorations/olive-branch/OliveBranch";

interface LoopSlideSectionProps {
  setIsLoopSlideVisible: (visible: boolean) => void;
  isExperienceIntroVisible: boolean;
}

export default function LoopSlideSection({
  setIsLoopSlideVisible,
  isExperienceIntroVisible,
}: LoopSlideSectionProps) {
  return (
    <section className={styles.sectionWrapper}>
      <OliveBranch />
      <AnimatedOnScroll
        className={styles.contentContainer}
        animationClass={styles.animateInRight}
        onVisibilityChange={setIsLoopSlideVisible}
      >
        {/* Section Title Container */}
        <div className={`
          ${styles.sectionTitle} 
          ${isExperienceIntroVisible ? styles.sectionTitleActive : ''}`}
        >
          <h2 className={styles.titleText}>
            Brew Focus. Eat Clean. Change Everything.
          </h2>
        </div>

        {/* Multi-Styled Infinite Slide Loop */}
        <InfiniteSlideLoop
          images={infoImages}
          className={`${styles.sliderCard} ${isExperienceIntroVisible ? styles.sliderCardActive : ''}`}
          itemsWrapperClassName={isExperienceIntroVisible ? styles.itemsWrapperVisible : styles.itemsWrapperHidden}
          slideTitleStyles={`${styles.itemTitle} ${isExperienceIntroVisible ? styles.itemTitleActive : ''}`}
        />
      </AnimatedOnScroll>
    </section>
  );
}