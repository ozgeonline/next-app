"use client";

import { useState, useEffect, useCallback } from "react";

export const useBreakpoints = (wrapperRef: React.RefObject<HTMLDivElement | null>) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(2);

  const [breakpoints, setBreakpoints] = useState({
    isXs: false,
    isSm: false,
    isMd: false,
    isLg: false,
    isXl: false,
  });

  const updateWidth = useCallback(() => {
    if (wrapperRef.current) {
      setSliderWidth(wrapperRef.current.clientWidth);
    }
  }, [wrapperRef]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    /**
     * EN: Cache the ref value in a local variable. During the cleanup phase, 
     * `wrapperRef.current` might already be mutated to `null` by React before 
     * the cleanup function executes, leading to memory leaks if unobserved improperly.
     */
    const currentWrapper = wrapperRef.current;
    let observer: ResizeObserver | null = null;

    if (currentWrapper) {
      observer = new ResizeObserver(() => {
        requestAnimationFrame(() => updateWidth());
      });
      observer.observe(currentWrapper);
    }

    const mediaQueries = {
      xs: window.matchMedia("(max-width: 639px)"),
      sm: window.matchMedia("(min-width: 640px) and (max-width: 767px)"),
      md: window.matchMedia("(min-width: 768px) and (max-width: 1023px)"),
      lg: window.matchMedia("(min-width: 1024px) and (max-width: 1279px)"),
      xl: window.matchMedia("(min-width: 1280px)"),
    };

    const handleMediaChange = () => {
      const isXl = mediaQueries.xl.matches;
      const isLg = mediaQueries.lg.matches;
      const isMd = mediaQueries.md.matches;
      const isSm = mediaQueries.sm.matches;
      const isXs = mediaQueries.xs.matches;

      setBreakpoints({ isXs, isSm, isMd, isLg, isXl });

      const slides = isXl ? 6 : isLg ? 5 : isMd ? 4 : isSm ? 3 : 2;
      setItemsPerView(slides);
    };

    Object.values(mediaQueries).forEach((mq) => {
      if (mq.addEventListener) {
        mq.addEventListener("change", handleMediaChange);
      }
    });

    handleMediaChange();
    updateWidth();

    // for Memory Leak Fix
    return () => {
      if (observer) observer.disconnect();

      Object.values(mediaQueries).forEach((mq) => {
        if (mq.removeEventListener) {
          mq.removeEventListener("change", handleMediaChange);
        }
      });
    };
  }, [updateWidth, wrapperRef]);

  return {
    sliderWidth,
    itemsPerView,
    ...breakpoints
  };
};