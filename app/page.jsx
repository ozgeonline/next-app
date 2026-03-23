"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import TopScrollButton from "@/components/ui/topScrollButton/TopScrollButton";
import { homePageitems } from "@/components/sections/cards/card-items";
import HeroBanner from "@/components/assets/heroBanner/HeroBanner";
import WavesBackground from "@/components/assets/wavesBackground/WavesBackground";
import styles from './page.module.css';

const SlideSection = dynamic(() => import('@/components/sections/slideSection/SlideSection'));
const PositionedImage = dynamic(() => import('@/components/sections/positioned-image/PositionedImage'));
const CTA = dynamic(() => import('@/components/sections/cta/CTA'));
const CommunityInfo = dynamic(() => import('@/components/sections/community-info/CommunityInfo'));
const LoopSlideSection = dynamic(() => import('@/components/sections/loop-slide-section/LoopSlideSection'));
const CardsSection = dynamic(() => import('@/components/sections/cards/CardsSection'));
const AnimatedSections = dynamic(() => import('@/components/sections/animated_sections/AnimatedSections'));


export default function Home() {
  const [isLoopSlideVisible, setIsLoopSlideVisible] = useState(false);
  const [isCommunityInfoVisible, setIsCommunityInfoVisible] = useState(false);

  return (
    <>
      <div className={styles.container}>

        {/* first view area */}
        <HeroBanner
          srcImage="https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFDwVyPtw4YqlTOprZ9Ac2Vvs1uHfUgS0GEoeBY"
          introductionTitle=""
          introduction=""
          reservationLink={true}
          socialLocation={true}
        />

        <>
          {/* Slide show & Loop slide section */}
          <SlideSection isCommunityInfoVisible={isCommunityInfoVisible} />

          <main className={styles.main + ' ' + "mainBackground"}>
            {/* Fixed Background Image & CTA Links Section*/}
            <section className={styles.mainContent + ' ' + "mainBackground"}>
              <WavesBackground />
              <PositionedImage isCommunityInfoVisible={isCommunityInfoVisible} />
              <CTA isCommunityInfoVisible={isCommunityInfoVisible} />
            </section>

            {/*** Community Info Text & Visible-Invisible Section */}
            <CommunityInfo setIsCommunityInfoVisible={setIsCommunityInfoVisible} />

            {/*Scroll Trigger - Loop Slide Section */}
            <LoopSlideSection
              isCommunityInfoVisible={isCommunityInfoVisible}
              isLoopSlideVisible={isLoopSlideVisible}
              setIsLoopSlideVisible={setIsLoopSlideVisible}
            />

            {/* Hover Cards Section */}
            <section>
              <CardsSection data={homePageitems} learnMore={true} />
            </section>

            {/* Scroll Trigger - Animated Image Sections & Image Info */}
            <section>
              <div
                style={{ position: 'relative', width: '100%', paddingBottom: '5rem' }}
                className="animatedSections mainBackground"
              >
                <AnimatedSections />
              </div>
            </section>
          </main>
        </>
      </div>

      <TopScrollButton />
    </>
  );
};