"use client";

import React, { useRef } from "react";
import { useBreakpoints } from "@/components/settings/breakpoint/useBreakpoints";
import styles from "./infinite-slide-loop.module.css";
import Image from "next/image";

interface InfiniteSlideLoopProps {
  images: Array<{ image: React.ReactNode | string; alt?: string; title?: string }>;
  className?: string;
  itemsWrapperClassName?: string;
  slideTitleStyles?: string;
}

export default function InfiniteSlideLoop({
  images,
  className,
  itemsWrapperClassName,
  slideTitleStyles
}: InfiniteSlideLoopProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  // Custom hook to get dynamic width per breakpoint
  const { sliderWidth, itemsPerView } = useBreakpoints(sliderRef);

  // Fallback to 0 if we haven't mounted or calculated width yet
  const itemWidth = sliderWidth > 0 && itemsPerView > 0 ? sliderWidth / itemsPerView : 0;

  // Custom scroll speed: seconds per original image item
  const SECONDS_PER_IMAGE = 4;
  const loopDuration = images.length * SECONDS_PER_IMAGE;

  // Protect against zero division and calculate the precise width of exactly 1 original group
  const safeImagesLength = Math.max(1, images.length);
  const groupWidth = safeImagesLength * itemWidth;

  // Calculating the number of clone copies
  const visibleFraction = itemsPerView / safeImagesLength;
  const clonesNeeded = Math.max(2, Math.ceil(visibleFraction) + 1);

  return (
    <div className={styles.sliderWrapper} ref={sliderRef}>
      <div
        className={styles.track}
        style={{
          // Pass the exact group width to CSS for the `@keyframes` animation
          "--group-width": `${groupWidth}px`,
          animationDuration: `${loopDuration}s`
        } as React.CSSProperties}
      >
        {/* We only render once itemWidth is correctly calculated */}
        {itemWidth > 0 && [...Array(clonesNeeded)].map((_, groupIndex) => (
          <div key={groupIndex} className={styles.slideGroup}>
            {images.map((item, index) => {
              const isComponent = React.isValidElement(item.image);

              return (
                <div key={`${groupIndex}-${index}`} className={styles.containerItems}>
                  <div
                    className={`${styles.itemsWrapper} ${itemsWrapperClassName || ""}`}
                    style={{ width: `${itemWidth}px` }}
                  >
                    <div className={`${styles.item} ${className || ""}`}>
                      {isComponent ? (
                        item.image
                      ) : (
                        <Image
                          src={item.image as string}
                          alt={item.alt ?? ""}
                          width={0}
                          height={0}
                          sizes="100%"
                          loading="eager"
                        />
                      )}
                    </div>
                  </div>
                  <p className={slideTitleStyles}>
                    {item?.title}
                  </p>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}