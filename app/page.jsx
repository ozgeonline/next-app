"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import {items} from '@/components/ui/sections/animated_sections/sections-items';
import {homePageitems} from "@/components/ui/sections/cards/card-items";
import styles from './page.module.css';

const HeroBanner = dynamic(() => import('@/components/ui/assets/heroBanner/HeroBanner'));
const SlideSection = dynamic(() => import('@/components/ui/sections/slideSection/SlideSection'));
const PositionedImage = dynamic(() => import('@/components/ui/sections/positioned_img/PositionedImage'));
const CTA = dynamic(() => import('@/components/ui/sections/cta/CTA'));
const CommunityInfo = dynamic(() => import('@/components/ui/sections/community_info/CommunityInfo'));
const LoopSlideSection = dynamic(() => import('@/components/ui/sections/scroll_trigger_loop_slides/LoopSlideSection'));
const CardsSection = dynamic(() => import('@/components/ui/sections/cards/CardsSection'));
const AnimatedSections = dynamic(() => import('@/components/ui/sections/animated_sections/AnimatedSections'));

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
        <CardsSection
          infoTitle={homePageitems.infoCard.title}
          infoDes={homePageitems.infoCard.description}
          infoBtn={true}
          imgBtn={true}
          imgSrc={homePageitems.imgCard.images.src}
          imgAlt={homePageitems.imgCard.images.alt}
          imgTitle={homePageitems.imgCard.title}
          imgDes={homePageitems.imgCard.description}
        />
       
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
                coloredArea={true}
              />
            );
          })}
        </div>
      </main>
      </>
    </div>
    </>
  );
};