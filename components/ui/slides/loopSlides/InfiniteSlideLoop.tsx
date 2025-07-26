"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { BreakpointSettings } from "@/components/settings/breakpoint/BreakpointSettings";
import styles from "./slider.module.css";
import Image from "next/image";

interface InfiniteSlideLoopProps {
  images: any[];
  className?: string;
  slideTitleStyles?: string;
}
export default function InfiniteSlideLoop({images, className, slideTitleStyles}: InfiniteSlideLoopProps) {
  const sliderRef = useRef(null);
  const sliderContainerRef = useRef(null);
  const { sliderWidth, itemsPerView } = BreakpointSettings(sliderRef);
  const animationRef = useRef(null);
  const [movedItems, setMovedItems] = useState(0);

  // useEffect(() => {
  //   if (sliderRef.current) {
  //       console.log("sliderWidth:", sliderWidth, "itemsPerView:", itemsPerView, "movedItems:", movedItems);
  //   }
  // }, [sliderWidth]);

  const speed = 1;
  //const speed = 0;
  const buffer = Math.ceil(speed) + 4;
  const displayItems = [
    ...images,
    ...images.slice(0, Math.max(0, itemsPerView + buffer - images.length)),
  ];

  const animate = useCallback(() => {
    if (!sliderContainerRef.current || !sliderRef.current) return;

    const container = sliderContainerRef.current;
    const itemWidth = sliderWidth / itemsPerView;
    const currentTransform = parseFloat(
      getComputedStyle(container).transform.replace(/[^0-9-,.]/g, "").split(",")[4] || "0"
    );
    //console.log("currentTransform:", currentTransform);

    let newTransform = currentTransform - speed;
    container.style.transform = `translateX(${newTransform}px)`;

    if (Math.abs(newTransform) >= itemWidth) {
      const firstItem = container.firstElementChild;
      if (firstItem) {
        container.insertAdjacentElement("beforeend", firstItem);
        if (movedItems + 1 > images.length-1) {
          newTransform = 0;
          setMovedItems(0);
        } else {
          newTransform = currentTransform + itemWidth - speed;
          setMovedItems((prev) => prev + 1);
        }
        container.style.transform = `translateX(${newTransform}px)`;
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [sliderWidth, itemsPerView, movedItems]);

  useEffect(() => {
    setMovedItems(0);
    if (sliderContainerRef.current) {
      sliderContainerRef.current.style.transform = `translateX(0px)`;
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, sliderWidth, itemsPerView]);

  return (
    <div className={styles.sliderWrapper} ref={sliderRef}>
      <div
        className={styles.slider}
        ref={sliderContainerRef}
        style={{ width: sliderWidth > 0 ? `${sliderWidth}px` : "100%" }}
      >
        {displayItems.map((item, index) => {
          const isComponent = React.isValidElement(item.image);

          return (
            <div key={index} className={styles.containerItems}>
              <div
                className={styles.itemsWrapper}
                style={{ width: `${sliderWidth / itemsPerView}px` }}
              >
                <div className={styles.item + " " + className}>
                  {isComponent ? (
                    item.image
                  ) : (
                    <Image
                      src={item.image}
                      alt={item.alt}
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
    </div>
  );
}