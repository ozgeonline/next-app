"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, Flame, Star } from "lucide-react";
import styles from "./menu.module.css";

export function MenuPreview({
  src,
  title,
  description,
  price,
  isNew
}) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <div className={styles.previewWrapper}>
      <div className={styles.imgWrapper}>
        <Image
          src={imgSrc}
          alt={`${title} - Menu Items `}
          sizes="100%"
          fill
          placeholder="blur"
          blurDataURL="/logo.png"
          onError={() => setImgSrc("/logo.png")}
        />
        {isNew && (
          <span className={styles.newBadge}>NEW</span>
        )}
      </div>
      <div className={styles.info}>
        <div className={styles.titleRow}>
          <h3>{title}</h3>
          <span className={`${styles.price}`}>
            {price}
            <span> $</span>
          </span>
        </div>
        <p>{description}</p>

        <div className={styles.statsRow}>
          <div className={styles.stars}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill="#6e737d90" color="#6e737d90" />
            ))}
          </div>
          <div className={styles.statItem}>
            <Clock size={14} />
            <span>5 min</span>
          </div>
          <span className={styles.statDivider}>|</span>
          <div className={styles.statItem}>
            <Flame size={14} />
            <span>335 Cal</span>
          </div>
        </div>
      </div>

    </div>
  )
}

export function MenuSection({ data }) {
  return (
    <div className={styles.menuItemsWrapper}>
      {data.menuItems.map((menuItem, i) => (
        <MenuPreview
          key={i}
          src={menuItem.image}
          description={menuItem.description}
          price={menuItem.price}
          title={menuItem.name}
          isNew={menuItem.isNew}
        />
      ))}
    </div>
  );
}