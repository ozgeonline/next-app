import AnimatedOnScroll from "@/components/providers/animation/AnimatedOnScroll";
import Link from "next/link";
import Image from "next/image";
import { ChevronsRight, MousePointerClick, Sun } from "lucide-react";
import styles from "./cards.module.css";

export default function CardsSection() {
  return (
    <AnimatedOnScroll
      className={styles.cardsWrapper}
      animationClass={styles.animateInRight}
    >
      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.cardTextLeft}>
            <h2> Healthy Drinks </h2>
            <p>Delicious, nutritious drinks that nourish your body and mind.</p>
            <div className={styles.learnMoreLeft} >
              <Link href="/drinks" title="Learn More">
                Learn More
                <span className={styles.arrow}>
                  <ChevronsRight size={20}/>
                </span>
              </Link>
            </div>
          </div>
          <div className={styles.sunWrapper}>
            <Sun className={styles.sun}/>
          </div>
        </div>
        <div className={styles.card}>
          <Image 
            src="https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFDDBYASjOqFG6PTzpu5yKOaUdhWesmxHnSvY0i"
            alt="Cafe Background"
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
            <h2>Healthy Meals</h2>
            <p>Delicious, nutritious meals that nourish your body and mind.</p>
            <Link href="/meals" className={styles.learnMore}>
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </AnimatedOnScroll>
  )
}