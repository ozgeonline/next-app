import AnimatedOnScroll from "@/components/ui/animation/animated-scroll/AnimatedOnScroll";
import styles from "./cta.module.css";
import Link from "next/link";

interface CTAContentProps {
  isExperienceIntroVisible: boolean;
}

export default function CTA({ isExperienceIntroVisible }: CTAContentProps) {
  return (
    <>
      {!isExperienceIntroVisible && (
        <AnimatedOnScroll
          className={styles.communityInvite}
          animationClass={styles.animateInBottom}
        >
          <div className={styles.inviteText}>
            Ready to transform your daily habits and unlock your full potential?
            Start your journey today!
          </div>
          <div className={styles.actionButtons}>
            <Link href="/community">Join</Link>
            <Link href="/meals">Explore</Link>
          </div>
        </AnimatedOnScroll>
      )}
    </>
  )
}