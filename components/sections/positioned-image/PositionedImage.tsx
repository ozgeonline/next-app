import { Leaf, HeartPulse, Users, Salad } from 'lucide-react';
import FeaturesStrip, { FeatureItem } from '@/components/sections/features-strip/FeaturesStrip';
import AnimatedOnScroll from '@/components/ui/animation/animated-scroll/AnimatedOnScroll';
import OliveBranch from '@/components/ui/decorations/olive-branch/OliveBranch';

import Image from 'next/image';
import styles from "./positioned-image.module.css";
import CTA from '@/components/sections/cta/CTA';


interface PositionedImageProps {
  isExperienceIntroVisible: boolean;
}

const homeFeatures: FeatureItem[] = [
  { icon: Salad, title: 'Clean Ingredients', description: 'Real food, real nutrition.' },
  { icon: HeartPulse, title: 'Mindful Meals', description: 'Eat with purpose.' },
  { icon: Users, title: 'Community First', description: 'Stronger together.' },
  { icon: Leaf, title: 'Healthy Lifestyle', description: 'Small changes, big impact.' },
];

export default function PositionedImage({ isExperienceIntroVisible }: PositionedImageProps) {
  return (
    <>
      <div className={styles.imgWrapper}>
        <div className={`
          ${isExperienceIntroVisible ? styles.fixedImage : styles.relativeImage} 
          ${styles.defaultImage}`}
        >
          <Image
            src="https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFDlLh8Vyqvj7qBtEJaeIm4Mu1klYRxAVTK8FdH"
            alt="Cafe Background"
            fill
            priority
            quality={100}
            sizes="100vw"
          />

          {/* Floating White Card */}
          {!isExperienceIntroVisible && (
            <div className={styles.floatingCard}>
              <div className={styles.iconCircle}>
                <Leaf size={20} strokeWidth={2} />
              </div>
              <div className={styles.cardText}>
                <strong>Live Well, Eat Well</strong>
                <p>Better food, better life.</p>
              </div>
            </div>
          )}
        </div>

        {/* Decorative Olive Branch */}
        {!isExperienceIntroVisible && (
          <OliveBranch />
        )}

        {/* Focus Section */}
        {!isExperienceIntroVisible && (
          <AnimatedOnScroll
            className="highlight-text-wrapper"
            animationClass={styles.animateInRight}
          >
            <p className='highlight-text'>Good food. Good mood. Great Life. —</p>
            <h1 className='highlight-text'>Nourish your body, energize your mind</h1>
            <p className='highlight-text'>Brew Focus. Eat Clean. Change Everything.</p>
            <CTA
              primaryButton={{ label: 'Join the Community', href: '/community' }}
              secondaryButton={{ label: 'Explore Meals', href: '/meals', chevronCount: 3 }}
            />
          </AnimatedOnScroll>
        )}
      </div>

      {/* Features Strip */}
      {!isExperienceIntroVisible && (
        <AnimatedOnScroll className={styles.featuresStripWrapper} animationClass={styles.animateInRight}>
          <FeaturesStrip items={homeFeatures} />
        </AnimatedOnScroll>
      )}
    </>
  );
}