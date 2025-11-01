"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AnimatedOnScroll from '@/components/providers/animation/AnimatedOnScroll';
import SocialMedia from '../../ui/social/SocialMedia';
import { IoLocationSharp } from "react-icons/io5";
import styles from './heroBanner.module.css';

export default function HeroBanner({
  srcImage,
  introductionTitle,
  introduction,
  reservationLink,
  socialLocation
}) {
  const [loaded, setLoaded] = useState(false);
  const [scale, setScale] = useState(1);
  const [brightness, setBrightness] = useState(0.7);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 500;

      const maxScale = 2;
      const minScale = 1;
      const maxBrightness = 0.7;
      const minBrightness = 0.1;

      const newScale = minScale + (maxScale - minScale) * Math.min(scrollY / maxScroll, 1);
      const newBrightness = maxBrightness - (maxBrightness - minBrightness) * Math.min(scrollY / maxScroll, 1);
      setScale(newScale);
      setBrightness(newBrightness);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={styles.container}
      style={{ background: loaded ? 'transparent' : 'var(--background)' }}
    >
      <div className={styles.backgroundWrapper}>
        <Image
          src={srcImage}
          alt="Background image"
          className={styles.mainBackground}
          style={{ transform: `scale(${scale})`, filter: `brightness(${brightness})`}}
          sizes='100%'
          width={0}
          height={0}
          onLoad={()=>setLoaded(true)}
        />
      </div>
     
      <AnimatedOnScroll animationClass={styles.animateInRight} className={styles.introduction}>
        <h1>{introductionTitle} </h1>
        <p> {introduction}</p>

       {reservationLink ? (
         <div className={styles.reservation}>
          <Link href="/reservations">
            Make Reservation 
          </Link>
        </div>
       ) : null}
      </AnimatedOnScroll>

     {socialLocation ? (
       <div className={styles.bottomSection}>
        <div className={styles.content + " " + styles["tracking-in-expand-fwd-top"]}>
          <SocialMedia />
          <div className={styles.location}>
            <IoLocationSharp className={styles.iconLocation}/>
            <span>Coding Str., Canggu, Bali</span>
          </div>
        </div>
      </div>
     ):null}
      
    </div>
  )
}