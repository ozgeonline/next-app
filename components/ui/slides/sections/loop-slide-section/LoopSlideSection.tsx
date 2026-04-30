import AnimatedOnScroll from "@/components/ui/animation/animated-scroll/AnimatedOnScroll";
import InfiniteSlideLoop from "@/components/ui/slides/loop-slides/InfiniteSlideLoop";
import { infoImages } from "@/components/ui/slides/slideshow-items";
import styles from "./loop-slide-section.module.css";

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

interface LoopSlideSectionProps {
  setIsLoopSlideVisible: (visible: boolean) => void;
  isExperienceIntroVisible: boolean;
}

export default function LoopSlideSection({
  setIsLoopSlideVisible,
  isExperienceIntroVisible,
}: LoopSlideSectionProps) {
  return (
    <section className={styles.section}>
      <AnimatedOnScroll
        className={styles.content}
        animationClass={styles.animateInRight}
        onVisibilityChange={setIsLoopSlideVisible}
      >
        <div className={styles.title}>
          <h3 className={isExperienceIntroVisible ? styles.activeTitle : "highlight-text"}>
            Brew Focus. Eat Clean. Change Everything.
          </h3>
        </div>

        <InfiniteSlideLoop
          images={infoImages}
          itemClassName={cx(
            styles.slideItem,
            isExperienceIntroVisible && styles.activeSlideItem,
          )}
          itemsWrapperClassName={cx(
            isExperienceIntroVisible ? styles.activeItems : "highlight-text",
          )}
          containerItemsWrapper={cx(
            styles.itemContent,
            !isExperienceIntroVisible && styles.compactItemContent,
          )}
          slideTitleStyles={cx(
            styles.itemTitle,
            isExperienceIntroVisible && styles.activeItemTitle,
          )}
        />
      </AnimatedOnScroll>
    </section>
  );
}
