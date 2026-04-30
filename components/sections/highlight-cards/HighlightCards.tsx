import AnimatedOnScroll from "@/components/ui/animation/animated-scroll/AnimatedOnScroll";
import Image from "next/image";
import { Cards } from "@/types/cardTypes";
import { ChevronsRight, MousePointerClick, Sun } from "lucide-react";
import styles from "./highlight-cards.module.css";
import OliveBranch from "@/components/ui/decorations/olive-branch/OliveBranch";
import { Button } from "@/components/ui/button/Button";

interface HighlightCardsProps {
  data: Cards
  learnMore?: boolean
}
export default function HighlightCards({
  data,
  learnMore
}: HighlightCardsProps) {
  return (
    <AnimatedOnScroll
      className={`${styles.cardsWrapper} mainBackground`}
      animationClass={styles.animateInRight}
    >
      <div className={styles.cards}>
        <div className={styles.card}>
          <OliveBranch className={styles.oliveDecoration} />
          <div className={styles.infoContent}>
            <h2>{data.infoCard.title}</h2>
            <p>{data.infoCard.description}</p>
            {data.link && (
              <Button
                href={data.link.href}
                variant="primary"
                className={styles.cardButton}
                iconRight={(
                  <span className={styles.arrow}>
                    <ChevronsRight size={20} />
                  </span>
                )}
              >
                {data.link.text}
              </Button>
            )}
          </div>
          <div className={styles.sunDecoration}>
            <Sun className={styles.sun} />
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
          <span className={styles.mobileHint}>
            click me
            <MousePointerClick />
          </span>
          <div className={styles.imageOverlayContent}>
            <h2>{data.imgCard.title}</h2>
            <p>{data.imgCard.description}</p>
            {learnMore && (
              <Button
                href="/meals"
                variant="secondary"
                className={styles.cardButton}
                iconRight={(
                  <span className={styles.arrow}>
                    <ChevronsRight size={20} />
                  </span>
                )}
              >
                Learn More
              </Button>
            )}
          </div>
        </div>
      </div>
    </AnimatedOnScroll>
  )
}
