"use client";
import { useState, useEffect, memo, useRef } from "react";
import Link from "next/link";
import { menuLinks } from "@/app/(pages)/menu/menu-items";
import styles from "./carousel.module.css";

function Carousel({ 
  children, 
  autoSlide = true, 
  dotType = "dot", 
  textLabels = [],
  carouselWrapper,
  dotsWrapper,
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const intervalRef = useRef(null);
  const startAutoSlide = () => {
    if (!autoSlide) return;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex < children.length - 1 ? prevIndex + 1 : 0
      );
    }, 10000);
  };

  const handleClick = (index) => {
    setCurrentImageIndex(index);
    startAutoSlide();
  };

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoSlide]);

  return (
    <div className={carouselWrapper}>
      <div className={dotsWrapper}>
        {children.map((_, index) => {
          const isActive = index === currentImageIndex;

          if (dotType === "text") {
            const label = textLabels[index] || `Menu ${index + 1}`;
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

          //default
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
        style={{
          transform: `translateX(-${currentImageIndex * 100}%)`,
          transition: "transform 0.5s ease-in-out",
        }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            className={`
              ${styles.itemWrapper} 
              ${dotType === "text" && styles.textWrapper}  
            `}
          >
            {child}
            {index === currentImageIndex &&
              menuLinks.map((item) => {
                const itemsData = item.desserts || item.drinks || item.meals || item.salads;
                if (!itemsData) return null;

                const label = textLabels[currentImageIndex];
                if (itemsData.title !== label) return null;

                return (
                  <Link key={itemsData.href} href={`menu/${itemsData.href}`} className={styles.viewAlllink}>
                    <button className={styles.viewAllButton + ' ' + "button-gold-on-dark"}>
                      View All {itemsData.title}
                    </button>
                  </Link>
                );
              })}
              <div className={styles.blurOverlay}/>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(Carousel);
