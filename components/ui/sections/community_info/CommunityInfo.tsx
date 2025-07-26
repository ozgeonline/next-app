import AnimatedOnScroll from "@/components/providers/animation/AnimatedOnScroll";
import styles from "./community-info.module.css";

interface CommunityInfoSectionProps {
  setIsCommunityInfoVisible: (visible: boolean) => void;
}

export default function CommunityInfo({ setIsCommunityInfoVisible }: CommunityInfoSectionProps) {
  return (
    <AnimatedOnScroll
      className={styles.containerWrapper}
      animationClass={styles.animateInRight}
      onVisibilityChange={(isVisible) => setIsCommunityInfoVisible(isVisible)}
    >
      <div className={styles.hero}>
        <h2> Create Your Own Recipe! </h2>
      </div>
      <div className={styles.definitionHero}>
        <p>
          Tired of the usual menus? Here, you're free to be creative! 
          Build your own dish or choose the ingredients and let our chef do the magic. 
          From breakfast and snacks to drinks and desserts — every flavor is shaped by your imagination.
        </p>
      </div>
      <div className={styles.hero}>
        <h2>Get Ready for a Tasty Experience</h2>
      </div>
      <div className={styles.definitionHero}>
        <p>
          This is more than just a place to eat — it's an experience. 
          From handcrafted drinks to freshly made desserts, everything is prepared with care. 
          We're here to delight your taste buds and offer you a cozy, flavorful atmosphere.
        </p>
      </div>
    </AnimatedOnScroll>
  )
}