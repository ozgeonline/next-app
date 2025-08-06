"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./menu-review.module.css";

export default function MenuPreview({
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
          width={0}
          height={0}
          placeholder="blur"
          blurDataURL="/logo.png"
          onError={() => setImgSrc("/logo.png")}
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