"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import TopScrollButton from "@/components/ui/topScrollButton/TopScrollButton";
import { homePageitems } from "@/components/sections/cards/card-items";
import HeroBanner from "@/components/assets/heroBanner/HeroBanner";
import styles from './page.module.css';

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

        {/* first view area */}
        <HeroBanner 
          srcImage="https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFDMrKaB2nlPGFDafBuW154icVrsNKdbwvp82nJ"
          introductionTitle="A Delicious Experience Awaits"
          introduction="Discover the flavors of the world, one cup at a time"
          reservationLink={true}
          socialLocation={true}
        />

        <>
          {/* Slide show & Loop slide section */}
          <SlideSection isCommunityInfoVisible={isCommunityInfoVisible} />

          <main className={styles.main + ' ' + "mainBackground"}>

            {/* Fixed Background Image & CTA Links Section*/}
            <section className={styles.mainContent  + ' ' + "mainBackground"}>
              <PositionedImage isCommunityInfoVisible={isCommunityInfoVisible} />
              <CTA isCommunityInfoVisible={isCommunityInfoVisible} />
            </section>

            {/***Community Info Text & Visible-Invisible Section */}
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
                style={{position: 'relative', width: '100%', paddingBottom: '5rem'}}
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