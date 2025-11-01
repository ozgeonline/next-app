"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import TopScrollButton from "@/components/ui/topScrollButton/TopScrollButton";
import styles from './page.module.css';

const HeroBanner = dynamic(() => import('@/components/assets/heroBanner/HeroBanner'));
const SlideSection = dynamic(() => import('@/components/sections/slideSection/SlideSection'));
const PositionedImage = dynamic(() => import('@/components/sections/positioned_img/PositionedImage'));
const CTA = dynamic(() => import('@/components/sections/cta/CTA'));
const CommunityInfo = dynamic(() => import('@/components/sections/community_info/CommunityInfo'));
const LoopSlideSection = dynamic(() => import('@/components/sections/scroll_trigger_loop_slides/LoopSlideSection'));
const CardsSection = dynamic(() => import('@/components/sections/cards/CardsSection'));
const AnimatedSections = dynamic(() => import('@/components/sections/animated_sections/AnimatedSections'));

export default function Home() {
  const [isLoopSlideVisible, setIsLoopSlideVisible] = useState(false);
  const [isCommunityInfoVisible, setIsCommunityInfoVisible] = useState(false);

  return (
    <>
    <div className={styles.container}>
      {/* SECTİON */}
      {/* first view area */}
      <HeroBanner 
        srcImage="https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFDMrKaB2nlPGFDafBuW154icVrsNKdbwvp82nJ"
        introductionTitle="A Delicious Experience Awaits"
        introduction="Discover the flavors of the world, one cup at a time"
        reservationLink={true}
        socialLocation={true}
      />

      <>
      {/* SECTİON */}
      <SlideSection isCommunityInfoVisible={isCommunityInfoVisible} />

      <main className={styles.main + ' ' + "mainBackground"}>
        {/* SECTİON */}
        <div className={styles.mainContent  + ' ' + "mainBackground"}>
          <PositionedImage isCommunityInfoVisible={isCommunityInfoVisible} />
          <CTA isCommunityInfoVisible={isCommunityInfoVisible} />
        </div>

        {/* SECTİON */}
        {/***Community Info Visible Section*/}
        <CommunityInfo setIsCommunityInfoVisible={setIsCommunityInfoVisible} />

        {/* SECTİON */}
        {/*Scroll Trigger - Loop Slide Section */}
        <LoopSlideSection
          isCommunityInfoVisible={isCommunityInfoVisible}
          isLoopSlideVisible={isLoopSlideVisible}
          setIsLoopSlideVisible={setIsLoopSlideVisible}
        />

        {/* Hover Cards Section */}
        <CardsSection homePage={true} />
       
        {/* SECTİON */}
        {/***********  Animated Cards Sections ***********/}
        <div
          style={{position: 'relative', width: '100%'}}
          className="animatedSections mainBackground"
        >
          <AnimatedSections />
        </div>
      </main>
      </>
    </div>
    
    <TopScrollButton />
    </>
  );
};