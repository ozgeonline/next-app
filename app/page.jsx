"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import TopScrollButton from "@/components/ui/topScrollButton/TopScrollButton";
import { homePageitems } from "@/components/sections/highlight-cards/card-items";
import HeroBanner from "@/components/ui/banners/hero-banner/HeroBanner";
import WavesBackground from "@/components/ui/backgrounds/wavesBackground/WavesBackground";
import styles from './page.module.css';

const SlideSection = dynamic(() => import('@/components/ui/slides/sections/slide-section/SlideSection'));
const PositionedImage = dynamic(() => import('@/components/sections/positioned-image/PositionedImage'));
const ExperienceIntro = dynamic(() => import('@/components/sections/experience-intro/ExperienceIntro'));
const LoopSlideSection = dynamic(() => import('@/components/ui/slides/sections/loop-slide-section/LoopSlideSection'));
const HighlightCards = dynamic(() => import('@/components/sections/highlight-cards/HighlightCards'));
const FeatureShowcase = dynamic(() => import('@/components/sections/feature-showcase/FeatureShowcase'));


export default function Home() {
  const [isLoopSlideVisible, setIsLoopSlideVisible] = useState(false);
  const [isExperienceIntroVisible, setIsExperienceIntroVisible] = useState(false);

  return (
    <>
      <div className={styles.container + ' ' + "mainBackground"}>

        {/* first view area */}
        <HeroBanner
          srcImage="https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFDXQCuYQHpFhv4Ib25fzmxotrdSguMEB7yl0VL"
          introductionTitle=""
          introduction=""
          reservationLink={true}
          socialLocation={true}
        />

        <>
          {/* Slide show & Loop slide section */}
          <SlideSection />

          <main className={styles.main}>
            {/* Background Image & CTA Links Section*/}
            <section className={styles.mainContent}>
              <WavesBackground />
              <PositionedImage isExperienceIntroVisible={isExperienceIntroVisible} />
            </section>

            {/*** Community Info Text & Visible-Invisible Section */}
            <ExperienceIntro setIsExperienceIntroVisible={setIsExperienceIntroVisible} />

            {/*Scroll Trigger - Loop Slide Section */}
            <LoopSlideSection
              isExperienceIntroVisible={isExperienceIntroVisible}
              isLoopSlideVisible={isLoopSlideVisible}
              setIsLoopSlideVisible={setIsLoopSlideVisible}
            />

            {/* Hover Cards Section */}
            <section>
              <HighlightCards data={homePageitems} learnMore={true} />
            </section>

            {/* Scroll Trigger - Animated Image Sections & Image Info */}
            <section>
              <div
                style={{ position: 'relative', width: '100%', paddingBottom: '5rem' }}
                className="animatedSections"
              >
                <FeatureShowcase />
              </div>
            </section>
          </main>
        </>
      </div>

      <TopScrollButton />
    </>
  );
};