"use client";

import styles from "./menu-review.module.css";
import Image from "next/image";

export default function MenuPreview({
  src,
  title,
  description,
  price,
  isNew
}) {
  return (
    <div className={styles.previewWrapper}>
      <div className={styles.imgWrapper}>
        <Image
          src={src}
          alt={`${title} - Menu Items `}
          sizes="100%"
          fill
          width={0}
          height={0}
        />    
      </div>
      <div className={styles.info}>
        <h3>
          {isNew && (
            <span className={styles.new}>(NEW) </span>
          )}
          {title}:
        </h3>
        <p>{description}</p>
      </div>
      <div className={styles.price}>
        {price} 
        <span>$</span>
      </div>
    </div>
  )
}