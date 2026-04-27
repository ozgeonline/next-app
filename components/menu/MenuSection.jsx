"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, Flame, Star, Heart } from "lucide-react";
import styles from "./menu.module.css";

export function MenuPreview({
  src,
  title,
  description,
  price,
  isNew,
  variant = "vertical"
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const isHorizontal = variant === "horizontal";

  return (
    <div className={`${styles.previewWrapper} ${isHorizontal ? styles.horizontal : ""}`}>
      <div className={styles.imgWrapper}>
        <div className={styles.imgContainer}>
          <Image
            src={imgSrc}
            alt={`${title} - Menu Items `}
            sizes="100%"
            fill
            placeholder="blur"
            blurDataURL="/logo.png"
            onError={() => setImgSrc("/logo.png")}
          />
        </div>
        {isNew && (
          <span className={styles.newBadge}>NEW</span>
        )}
        <button className={styles.heartButton} aria-label="Add to favorites">
          <Heart size={20} strokeWidth={1.5} />
        </button>
        <div className={styles.pricePill}>
          {price} $
        </div>
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>

        <div className={styles.statsRow}>
          <div className={styles.stars}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill="var(--lunar-green-400, #517b65)"
                color="var(--lunar-green-400, #517b65)"
              />
            ))}
          </div>
          <span className={styles.statDivider}>|</span>
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