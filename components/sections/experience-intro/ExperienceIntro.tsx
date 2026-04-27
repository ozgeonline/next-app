import AnimatedOnScroll from "@/components/ui/animation/animated-scroll/AnimatedOnScroll";
import styles from "./experience-intro.module.css";

interface ExperienceIntroSectionProps {
  setIsExperienceIntroVisible: (visible: boolean) => void;
}

export default function ExperienceIntro({ setIsExperienceIntroVisible }: ExperienceIntroSectionProps) {
  return (
    <AnimatedOnScroll
      className={styles.containerWrapper}
      animationClass={styles.animateInRight}
      onVisibilityChange={(isVisible) => setIsExperienceIntroVisible(isVisible)}
    >
      <div className={styles.hero}>
        <h3 className="gradient-full-gold-text"> Create Your Own Recipe! </h3>
      </div>
      <div className={styles.definitionHero}>
        <p>
          Tired of the usual menus? Here, you&#39;re free to be creative!
          Build your own dish or choose the ingredients and let our chef do the magic.
          From breakfast and snacks to drinks and desserts — every flavor is shaped by your imagination.
        </p>
      </div>
      <div className={styles.hero}>
        <h3 className="gradient-full-gold-text">Get Ready for a Tasty Experience</h3>
      </div>
      <div className={styles.definitionHero}>
        <p>
          This is more than just a place to eat — it&#39;s an experience.
          From handcrafted drinks to freshly made desserts, everything is prepared with care.
          We&#39;re here to delight your taste buds and offer you a cozy, flavorful atmosphere.
        </p>
      </div>
    </AnimatedOnScroll>
  )
}