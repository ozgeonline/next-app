// Hero Banner component: Displays a dynamic, full-width introduction banner with scroll-based scale and brightness animations.
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Leaf, Coffee, Utensils, Cake } from 'lucide-react';
import AnimatedOnScroll from '@/components/ui/animation/animated-scroll/AnimatedOnScroll';
import SocialMedia from '@/components/ui/social/SocialMedia';
import { IoLocationSharp } from "react-icons/io5";
import styles from './heroBanner.module.css';

const ICON_MAP = {
  Leaf,
  Coffee,
  Utensils,
  Cake
};

const SCROLL_CONFIG = {
  maxScroll: 500,
  maxScale: 1.5,
  minScale: 1,
  maxBrightness: 1,
  minBrightness: 0.3
};

export default function HeroBanner({
  srcImage,
  introductionTitle,
  introduction,
  reservationLink,
  socialLocation,
  variant = 'default', // 'default' or 'menu'
  label,
  icon,
  highlightWord,
  actionLink = '/menu/desserts',
  actionText = 'Explore Our Menu'
}) {
  const Icon = typeof icon === 'string' ? ICON_MAP[icon] : icon;

  const [loaded, setLoaded] = useState(false);
  const [scale, setScale] = useState(1);
  const [brightness, setBrightness] = useState(1);
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

  const renderTitle = () => {
    if (!highlightWord || !introductionTitle) return introductionTitle;
    const parts = introductionTitle.split(highlightWord);
    if (parts.length < 2) return introductionTitle;

    return (
      <>
        {parts[0]}
        <span className={styles.highlight}>{highlightWord}</span>
        {parts[1]}
      </>
    );
  };

  const isMenu = variant === 'menu';

  return (
    <div
      className={`${styles.container}`}
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
        {isMenu && <div className={styles.gradientOverlay} />}
      </div>

      <AnimatedOnScroll
        animationClass={styles.animateInRight}
        className={`${styles.introduction} ${isMenu ? styles.menuContent : ''}`}
      >
        {isMenu && label && (
          <div className={styles.labelWrapper}>
            {Icon && (
              <div className={styles.iconCircle}>
                <Icon size={16} />
              </div>
            )}
            <span className={styles.label}>{label}</span>
          </div>
        )}

        <h1 className={isMenu ? styles.menuTitle : ''}>{isMenu ? renderTitle() : introductionTitle} </h1>
        <p className={isMenu ? styles.menuDescription : ''}> {introduction}</p>

        {isMenu ? (
          <Link href={actionLink} className={styles.exploreButton}>
            {actionText}
            <ArrowRight size={18} />
          </Link>
        ) : (
          reservationLink && (
            <div className={styles.reservation}>
              <Link href="/reservations">
                Make Reservation
              </Link>
            </div>
          )
        )}
      </AnimatedOnScroll>

      {socialLocation && !isMenu && (
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