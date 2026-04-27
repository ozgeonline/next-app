"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";
import styles from "./reservation.module.css";
import { useTheme } from "@/context/theme/ThemeProvider";

import WavesBackground from "@/components/ui/backgrounds/wavesBackground/WavesBackground";

export default function ReservationBanner() {
  const { theme } = useTheme();

  const leftImageSrc = theme === "dark"
    ? "https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFDOH2Qagk62Mm1Oej967Rgn30AC4GDqhS5yZxW"
    : "https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFDn06jvhwgCF8pXm6ZvtROEfou3csW7UJnz9Qr";

  return (
    <div className={styles.bannerContainer}>
      {/* Background Component */}
      <WavesBackground />

      {/* Decorative Food Images */}
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
          src="https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFDwDqEN2YqlTOprZ9Ac2Vvs1uHfUgS0GEoeBYX"
          alt="Charcuterie Board"
          width={900}
          height={900}
          className={styles.boardImage}
        />
      </div>

      {/* Center Content */}
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

        <Link href="/reservations" className={styles.ctaButton}>
          Make Reservation
          <ArrowRight size={18} className={styles.arrowIcon} />
        </Link>

      </div>

      {/* Floating Leaves */}
      <div className={`${styles.floatingLeaf} ${styles.leaf1}`}>
        <Image
          src="https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFD76Nmf5iOMUbcyZrusmv9W6AXFEDzkwg3leLi"
          alt="leaf"
          width={200}
          height={200}
        />
      </div>
      <div className={`${styles.floatingLeaf} ${styles.leaf2}`}>
        <Image
          src="https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFD76Nmf5iOMUbcyZrusmv9W6AXFEDzkwg3leLi"
          alt="leaf"
          width={150}
          height={150}
        />
      </div>
    </div>
  );
}