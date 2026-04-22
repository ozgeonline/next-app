// Hero Banner component: Displays a dynamic, full-width introduction banner with scroll-based scale and brightness animations.
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AnimatedOnScroll from '@/components/ui/animation/animated-scroll/AnimatedOnScroll';
import SocialMedia from '@/components/ui/social/SocialMedia';
import { IoLocationSharp } from "react-icons/io5";
import styles from './heroBanner.module.css';

const SCROLL_CONFIG = {
  maxScroll: 500,
  maxScale: 2,
  minScale: 1,
  maxBrightness: 0.9,
  minBrightness: 0.1
};

export default function HeroBanner({
  srcImage,
  introductionTitle,
  introduction,
  reservationLink,
  socialLocation
}) {
  const [loaded, setLoaded] = useState(false);
  const [scale, setScale] = useState(1);
  const [brightness, setBrightness] = useState(SCROLL_CONFIG.maxBrightness);
  const rafId = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (rafId.current) return;

      rafId.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const { maxScroll, maxScale, minScale, maxBrightness, minBrightness } = SCROLL_CONFIG;

        const scrollProgress = Math.min(scrollY / maxScroll, 1);
        setScale(minScale + (maxScale - minScale) * scrollProgress);
        setBrightness(maxBrightness - (maxBrightness - minBrightness) * scrollProgress);

        rafId.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div
      className={styles.container}
      style={{ backgroundColor: loaded ? 'transparent' : 'var(--background)' }}
    >
      <div className={styles.backgroundWrapper}>
        <Image
          src={srcImage}
          alt={introductionTitle || "Hero Background"}
          className={styles.mainBackground}
          style={{
            transform: `scale(${scale})`,
            filter: `brightness(${brightness})`,
            objectFit: 'cover',
            width: '100%',
            height: '100%'
          }}
          width={0}
          height={0}
          sizes="100vw"
          quality={90}
          priority
          onLoad={() => setLoaded(true)}
        />
      </div>

      <AnimatedOnScroll animationClass={styles.animateInRight} className={styles.introduction}>
        <h1>{introductionTitle} </h1>
        <p> {introduction}</p>

        {reservationLink && (
          <div className={styles.reservation}>
            <Link href="/reservations">
              Make Reservation
            </Link>
          </div>
        )}
      </AnimatedOnScroll>

      {socialLocation && (
        <div className={styles.bottomSection}>
          <div className={`${styles.content} ${styles['tracking-in-expand-fwd-top']}`}>
            <SocialMedia strokeColor='#3d4148' />
            <div className={styles.location}>
              <IoLocationSharp className={styles.iconLocation} />
              <span>Coding Str., Canggu, Bali</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}