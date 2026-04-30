"use client";

import Image from "next/image";
import { ArrowRight, Leaf } from "lucide-react";
import { useTheme } from "@/context/theme/ThemeProvider";
import { Button } from "@/components/ui/button/Button";
import WavesBackground from "@/components/ui/backgrounds/wavesBackground/WavesBackground";
import styles from "./reservation.module.css";

const LEAF_IMAGE_SRC =
  "https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFD76Nmf5iOMUbcyZrusmv9W6AXFEDzkwg3leLi";

const DECOR_IMAGES = {
  leftDark: "https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFDOH2Qagk62Mm1Oej967Rgn30AC4GDqhS5yZxW",
  leftLight: "https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFDn06jvhwgCF8pXm6ZvtROEfou3csW7UJnz9Qr",
  right: "https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFDwDqEN2YqlTOprZ9Ac2Vvs1uHfUgS0GEoeBYX",
};

const floatingLeaves = [
  { className: styles.leaf1, size: 200 },
  { className: styles.leaf2, size: 150 },
];

const cx = (...classes) => classes.filter(Boolean).join(" ");

export default function ReservationBanner() {
  const { theme } = useTheme();

  const leftImageSrc = theme === "dark"
    ? DECOR_IMAGES.leftDark
    : DECOR_IMAGES.leftLight;

  return (
    <div className={styles.bannerContainer}>
      <WavesBackground />

      <div className={styles.decorLeft}>
        <Image
          src={leftImageSrc}
          alt="Appetizer Plate"
          width={400}
          height={400}
          className={styles.plateImage}
        />
      </div>

      <div className={styles.decorRight}>
        <Image
          src={DECOR_IMAGES.right}
          alt="Charcuterie Board"
          width={900}
          height={900}
          className={styles.boardImage}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.subtitleRow}>
          <div className={styles.line} />
          <Leaf size={18} className={styles.leafIcon} />
          <span className={styles.subtitle}>GOOD FOOD, GREAT MOMENTS</span>
          <div className={styles.line} />
        </div>

        <h2 className={styles.title}>
          For a Wonderful <span className={styles.highlight}>Experience</span>
        </h2>

        <p className={styles.description}>
          From unforgettable flavors to warm hospitality,
          we create moments you'll love to share.
        </p>

        <Button
          href="/reservations"
          variant="secondary"
          className={styles.ctaButton}
          iconRight={<ArrowRight size={18} className={styles.arrowIcon} />}
        >
          Make Reservation
        </Button>
      </div>

      {floatingLeaves.map(({ className, size }) => (
        <div key={className} className={cx(styles.floatingLeaf, className)}>
          <Image
            src={LEAF_IMAGE_SRC}
            alt=""
            width={size}
            height={size}
          />
        </div>
      ))}
    </div>
  );
}
