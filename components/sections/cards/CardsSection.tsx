import AnimatedOnScroll from "@/components/providers/animation/AnimatedOnScroll";
import Link from "next/link";
import Image from "next/image";
import { Cards } from "@/types/cardTypes";
import { ChevronsRight, MousePointerClick, Sun } from "lucide-react";
import styles from "./cards.module.css";

interface CardsSectionProps {
  data:Cards
  learnMore?:boolean
}
export default function CardsSection({
  data,
  learnMore
}:CardsSectionProps) {
  return (
    <AnimatedOnScroll
      className={styles.cardsWrapper  + ' ' + "mainBackground"}
      animationClass={styles.animateInRight}
    >
      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.cardTextLeft}>
            <h2>{data.infoCard.title}</h2>
            <p>{data.infoCard.description}</p>
            <div className={styles.learnMoreLeft}>
              {data.link && (
                <Link href={data.link.href}>
                  {data.link.text}
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
            src={data.imgCard.images.src}
            alt={data.imgCard.images.alt}
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
            <h2>{data.imgCard.title}</h2>
            <p>{data.imgCard.description}</p>
            {learnMore && (
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