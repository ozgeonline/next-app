"use client";

import { Children, memo, useCallback, useEffect, useRef, useState } from "react";
import styles from "./carousel.module.css";

const SLIDE_INTERVAL_MS = 10000;

const cx = (...classes) => classes.filter(Boolean).join(" ");

function Carousel({
  children,
  autoSlide = true,
  dotType = "dot",
  textLabels = [],
  carouselWrapper,
  dotsWrapper,
  renderSlideFooter,
  customDot,
  ...props
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const intervalRef = useRef(null);
  const slides = Children.toArray(children);
  const slideCount = slides.length;

  const startAutoSlide = useCallback(() => {
    if (!autoSlide || slideCount <= 1) return;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex < slideCount - 1 ? prevIndex + 1 : 0
      );
    }, SLIDE_INTERVAL_MS);
  }, [autoSlide, slideCount]);

  const stopAutoSlide = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const handleClick = (index) => {
    setCurrentImageIndex(index);
    startAutoSlide();
  };

  useEffect(() => {
    startAutoSlide();
    return stopAutoSlide;
  }, [startAutoSlide, stopAutoSlide]);

  if (slideCount === 0) return null;

  return (
    <div className={carouselWrapper} {...props}>
      <div className={dotsWrapper}>
        {slides.map((_, index) => {
          const isActive = index === currentImageIndex;

          if (customDot) {
            return customDot(index, isActive, () => handleClick(index));
          }

          if (dotType === "text") {
            const label = textLabels[index] || `Slide ${index + 1}`;
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleClick(index)}
                className={cx(styles.textDot, isActive && styles.activeText)}
                aria-current={isActive ? "true" : undefined}
              >
                {label}
              </button>
            );
          }

          return (
            <button
              key={index}
              type="button"
              className={cx(styles.dot, isActive ? styles.activeDot : styles.inactiveDot)}
              onClick={() => handleClick(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={isActive ? "true" : undefined}
            />
          );
        })}
      </div>
      <div
        className={styles.slider}
        style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
      >
        {slides.map((child, index) => (
          <div
            key={index}
            className={cx(styles.itemWrapper, dotType === "text" && styles.textWrapper)}
          >
            {child}
            {index === currentImageIndex && renderSlideFooter?.(index)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(Carousel);
