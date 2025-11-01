import AnimatedOnScroll from "@/components/providers/animation/AnimatedOnScroll";
import styles from "./cta.module.css";
import Link from "next/link";

interface CTAContentProps {
  isCommunityInfoVisible: boolean;
}

export default function CTA({ isCommunityInfoVisible }: CTAContentProps) {
  return (
    <>
    {!isCommunityInfoVisible && (
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