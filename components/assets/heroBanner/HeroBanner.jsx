'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AnimatedOnScroll from '@/components/ui/animation/animated-scroll/AnimatedOnScroll';
import SocialMedia from '../../ui/social/SocialMedia';
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
  const imageRef = useRef(null);
  const rafId = useRef(null);

  useEffect(() => {
    // Provide an initial calculation immediately on component mount
    const handleScroll = () => {
      if (rafId.current) return;

      rafId.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const {
          maxScroll,
          maxScale,
          minScale,
          maxBrightness,
          minBrightness
        } = SCROLL_CONFIG;

        // scrollY is constrained to a ratio between 0 and 1
        const scrollProgress = Math.min(scrollY / maxScroll, 1);
        const newScale = minScale + (maxScale - minScale) * scrollProgress;
        const newBrightness = maxBrightness - (maxBrightness - minBrightness) * scrollProgress;

        if (imageRef.current) {
          imageRef.current.style.transform = `scale(${newScale})`;
          imageRef.current.style.filter = `brightness(${newBrightness})`;
        }

        rafId.current = null;
      });
    };

    handleScroll();
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
          ref={imageRef}
          src={srcImage}
          alt={introductionTitle || "Hero Background"}
          className={styles.mainBackground}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            willChange: 'transform, filter'
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
            <SocialMedia />
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