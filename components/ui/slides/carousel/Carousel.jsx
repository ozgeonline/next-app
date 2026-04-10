// Carousel component:
// renders a horizontal slider with dot or text navigation and optional auto-slide.

"use client";
import { useState, useEffect, memo, useRef, useCallback } from "react";
import styles from "./carousel.module.css";

function Carousel({
  children,
  autoSlide = true,
  dotType = "dot",
  textLabels = [],
  carouselWrapper,
  dotsWrapper,
  renderSlideFooter,
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const intervalRef = useRef(null);

  const startAutoSlide = useCallback(() => {
    if (!autoSlide) return;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex < children.length - 1 ? prevIndex + 1 : 0
      );
    }, 10000);
  }, [autoSlide, children.length]);

  const handleClick = (index) => {
    setCurrentImageIndex(index);
    startAutoSlide();
  };

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoSlide]);

  return (
    <div className={carouselWrapper}>
      <div className={dotsWrapper}>
        {children.map((_, index) => {
          const isActive = index === currentImageIndex;

          if (dotType === "text") {
            const label = textLabels[index] || `Slide ${index + 1}`;
            return (
              <span
                key={index}
                onClick={() => handleClick(index)}
                className={`${styles.textDot} ${isActive ? styles.activeText : ""}`}
              >
                {label}
              </span>
            );
          }

          return (
            <div
              key={index}
              className={`${isActive ? styles.opacity100 : styles.opacity50} ${styles.dot}`}
              onClick={() => handleClick(index)}
            />
          );
        })}
      </div>
      <div
        className={styles.slider}
        style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            className={`${styles.itemWrapper} ${dotType === "text" ? styles.textWrapper : ""}`}
          >
            {child}
            {index === currentImageIndex && renderSlideFooter?.(index)}
            <div className={styles.blurOverlay} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(Carousel);
