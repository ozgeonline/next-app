import AnimatedOnScroll from "@/components/providers/animation/AnimatedOnScroll";
import Link from "next/link";
import Image from "next/image";
import { ChevronsRight, MousePointerClick, Sun } from "lucide-react";
import styles from "./cards.module.css";

interface CardsSectionProps {
  infoTitle?:string
  infoDes?:string
  infoBtn?:boolean
  imgSrc?:string
  imgAlt?:string
  imgTitle?:string
  imgDes?:string
  imgBtn?:string
}
export default function CardsSection({
  infoTitle,
  infoDes,
  infoBtn,
  imgSrc,
  imgAlt,
  imgTitle,
  imgDes,
  imgBtn
}:CardsSectionProps) {
  return (
    <AnimatedOnScroll
      className={styles.cardsWrapper  + ' ' + "mainBackground"}
      animationClass={styles.animateInRight}
    >
      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.cardTextLeft}>
            <h2>{infoTitle}</h2>
            <p>{infoDes}</p>
            {infoBtn && (
              <div className={styles.learnMoreLeft} >
                <Link href="/drinks" title="Learn More">
                  Learn More
                  <span className={styles.arrow}>
                    <ChevronsRight size={20}/>
                  </span>
                </Link>
              </div>
            )}
          </div>
          <div className={styles.sunWrapper}>
            <Sun className={styles.sun}/>
          </div>
        </div>
        <div className={styles.card}>
          <Image 
            src={imgSrc!}
            alt={imgAlt!}
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
            <h2>{imgTitle}</h2>
            <p>{imgDes}</p>
            {imgBtn && (
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