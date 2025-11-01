import AnimatedOnScroll from "@/components/providers/animation/AnimatedOnScroll";
import Link from "next/link";
import Image from "next/image";
import { menuPageitems, homePageitems } from "@/components/sections/cards/card-items";
import { ChevronsRight, MousePointerClick, Sun } from "lucide-react";
import styles from "./cards.module.css";

interface CardsSectionProps {
  homePage?:boolean
  menuPage?:boolean
}
export default function CardsSection({
  homePage,
  menuPage
}:CardsSectionProps) {
  return (
    <AnimatedOnScroll
      className={styles.cardsWrapper  + ' ' + "mainBackground"}
      animationClass={styles.animateInRight}
    >
      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.cardTextLeft}>
            <h2>{homePage ? homePageitems.infoCard.title : menuPageitems.infoCard.title}</h2>
            <p>{homePage ? homePageitems.infoCard.description : menuPageitems.infoCard.description}</p>
            <div className={styles.learnMoreLeft}>
              {homePage && (
                <Link href="/drinks">
                  Learn More
                  <span className={styles.arrow}>
                    <ChevronsRight size={20}/>
                  </span>
                </Link>
              )}

              {menuPage && (
                <Link href="/meals/share">
                  Share Meals
                  <span className={styles.arrow}>
                    <ChevronsRight size={20}/>
                  </span>
                </Link>
              )}
            </div>
          </div>
          <div className={styles.sunWrapper}>
            <Sun className={styles.sun}/>
          </div>
        </div>
        <div className={styles.card}>
          <Image 
            src={homePage ? homePageitems.imgCard.images.src! : menuPageitems.imgCard.images.src!}
            alt={homePage ? homePageitems.imgCard.images.alt! : menuPageitems.imgCard.images.alt!}
            fill
            sizes='100%'
            width={0}
            height={0}
          />
          <span className={styles.cardClick}>
            click me 
            <MousePointerClick />
          </span>
          <div className={styles.cardText}>
            <h2>{homePage ? homePageitems.imgCard.title : menuPageitems.imgCard.title}</h2>
            <p>{homePage ? homePageitems.imgCard.description : menuPageitems.imgCard.description}</p>
            {homePage && (
              <Link href="/meals" className={styles.learnMore}>
                Learn More
              </Link>
            )}
          </div>
        </div>
      </div>
    </AnimatedOnScroll>
  )
}