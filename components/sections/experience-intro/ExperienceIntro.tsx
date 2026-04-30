import AnimatedOnScroll from "@/components/ui/animation/animated-scroll/AnimatedOnScroll";
import styles from "./experience-intro.module.css";

interface ExperienceIntroSectionProps {
  setIsExperienceIntroVisible: (visible: boolean) => void;
}

const introItems = [
  {
    title: "Create Your Own Recipe!",
    description:
      "Tired of the usual menus? Here, you're free to be creative! Build your own dish or choose the ingredients and let our chef do the magic. From breakfast and snacks to drinks and desserts - every flavor is shaped by your imagination.",
  },
  {
    title: "Get Ready for a Tasty Experience",
    description:
      "This is more than just a place to eat - it's an experience. From handcrafted drinks to freshly made desserts, everything is prepared with care. We're here to delight your taste buds and offer you a cozy, flavorful atmosphere.",
  },
];

export default function ExperienceIntro({ setIsExperienceIntroVisible }: ExperienceIntroSectionProps) {
  return (
    <AnimatedOnScroll
      className={styles.section}
      animationClass={styles.animateInRight}
      onVisibilityChange={setIsExperienceIntroVisible}
    >
      {introItems.map((item) => (
        <div className={styles.introBlock} key={item.title}>
          <h2 className={styles.introTitle}>{item.title}</h2>
          <p className={styles.introText}>{item.description}</p>
        </div>
      ))}
    </AnimatedOnScroll>
  );
}
