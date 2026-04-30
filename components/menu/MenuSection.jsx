"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, Flame, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import styles from "./menu.module.css";

const RATING_STARS = 5;

const cx = (...classes) => classes.filter(Boolean).join(" ");

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
    <div className={cx(styles.previewWrapper, isHorizontal && styles.horizontal)}>
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
        <Button
          type="button"
          variant="plain"
          className={styles.heartButton}
          aria-label="Add to favorites"
          iconLeft={<Heart size={25} strokeWidth={2} />}
        />
        <div className={styles.pricePill}>
          {price} $
        </div>
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>

        <div className={styles.statsRow}>
          <div className={styles.stars}>
            {Array.from({ length: RATING_STARS }, (_, i) => (
              <Star
                key={i}
                size={14}
                className={styles.starIcon}
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
      {data.menuItems.map((menuItem) => (
        <MenuPreview
          key={menuItem.name}
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
