"use client";

import { useState } from 'react';

import HeroBanner from '@/components/ui/assets/heroBanner/HeroBanner';
import SlideSection from '@/components/ui/sections/slide/SlideSection';
import PositionedImage from '@/components/ui/sections/positioned_img/PositionedImage';
import CTA from '@/components/ui/sections/cta/CTA';
import CommunityInfo from '@/components/ui/sections/community_info/CommunityInfo';
import LoopSlideSection from '@/components/ui/sections/scroll_trigger_loop_slides/LoopSlideSection';
import CardsSection from '@/components/ui/sections/cards/CardsSection';
import AnimatedSections from '@/components/ui/sections/animated_sections/AnimatedSections';
import Footer from '@/components/ui/sections/footer/Footer';

import {items} from '@/components/ui/sections/animated_sections/sections-items';
import styles from './page.module.css';

export default function Home() {
  const [isLoopSlideVisible, setIsLoopSlideVisible] = useState(false);
  const [isCommunityInfoVisible, setIsCommunityInfoVisible] = useState(false);

  return (
    <>
    <div className={styles.container}>
      {/* first view area */}
      <HeroBanner srcImage="https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFDMrKaB2nlPGFDafBuW154icVrsNKdbwvp82nJ"/>

      <>
      <SlideSection isCommunityInfoVisible={isCommunityInfoVisible} />
      <main className={styles.main}>
        <div className={styles.mainContent}>
          <PositionedImage isCommunityInfoVisible={isCommunityInfoVisible} />
          <CTA isCommunityInfoVisible={isCommunityInfoVisible} />
        </div>

        {/***Community Info Visible Section*/}
        <CommunityInfo setIsCommunityInfoVisible={setIsCommunityInfoVisible} />

        {/*Scroll Trigger - Loop Slide Section */}
        <LoopSlideSection
          isCommunityInfoVisible={isCommunityInfoVisible}
          isLoopSlideVisible={isLoopSlideVisible}
          setIsLoopSlideVisible={setIsLoopSlideVisible}
        />

        {/* Hover Cards Section */}
        <CardsSection />
       
        {/***********  Animated Sections ***********/}
        <div style={{position: 'relative', width: '100%'}}>
          {items.map((item, index) => {
            const sectionData = item.savor || item.desserts || item.energy;
            if (!sectionData) return null;
            return (
              <AnimatedSections
                key={index}
                title={sectionData.title}
                description={sectionData.description}
                images={sectionData.images}
                reverse={sectionData.reverse}
              />
            );
          })}
        </div>
      </main>

      {/* for fixed footer */}
      <div style={{height: '100vh', zIndex: '-500'}} />
      </>
    </div>
    <div className={styles.footerWrapper}>
      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
    </>
  );
};