import AnimatedOnScroll from "@/components/ui/animation/animated-scroll/AnimatedOnScroll";
import InfiniteSlideLoop from "@/components/ui/slides/loop-slides/InfiniteSlideLoop";
import { infoImages } from "@/components/ui/slides/slideshow-items";
import styles from "./loop-slide-section.module.css";

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
          <h2 className={`${isExperienceIntroVisible ? styles.titleText : "highlight-text"} `}>
            Brew Focus. <span>Eat Clean.</span> Change Everything.
          </h2>
        </div>

        {/* Multi-Styled Infinite Slide Loop */}
        <InfiniteSlideLoop
          images={infoImages}
          itemClassName={`
            ${styles.sliderCard}
            ${isExperienceIntroVisible ? styles.sliderCardActive : ''}
          `}
          itemsWrapperClassName={`
            ${styles.itemsWrapper}
            ${isExperienceIntroVisible ? styles.itemsWrapperVisible : ''}
          `}
          containerItemsWrapper={`
            ${styles.containerItems}
            ${isExperienceIntroVisible ? styles.containerItemsActive : styles.containerItemsClosed}
          `}
          slideTitleStyles={`
            ${styles.itemTitle}
            ${isExperienceIntroVisible ? styles.itemTitleActive : ''}
          `}
        />
      </AnimatedOnScroll>
    </section>
  );
}