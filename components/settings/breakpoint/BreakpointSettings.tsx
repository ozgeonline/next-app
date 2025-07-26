"use client";

import { useState, useEffect } from "react";

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

const breakpointConditions: Record<Breakpoint, (width: number) => boolean> = {
  xs: (width) => width < 640,
  sm: (width) => width >= 640 && width < 768,
  md: (width) => width >= 768 && width < 1024,
  lg: (width) => width >= 1024 && width < 1280,
  xl: (width) => width >= 1280,
};

export const BreakpointSettings = (wrapperRef: React.RefObject<HTMLDivElement>) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(2);
  const isClient = typeof window !== "undefined";

  const getBreakpointState = (breakpoint: Breakpoint): boolean => {
    if (!isClient) return false;
    const condition = breakpointConditions[breakpoint];
    //console.log("window.innerWidth",window.innerWidth)
    return condition ? condition(window.innerWidth) : false;
  };

  const [isXs, setIsXs] = useState<boolean | null>(isClient ? getBreakpointState("xs") : null);
  const [isSm, setIsSm] = useState<boolean | null>(isClient ? getBreakpointState("sm") : null);
  const [isMd, setIsMd] = useState<boolean | null>(isClient ? getBreakpointState("md") : null);
  const [isLg, setIsLg] = useState<boolean | null>(isClient ? getBreakpointState("lg") : null);
  const [isXl, setIsXl] = useState<boolean | null>(isClient ? getBreakpointState("xl") : null);

  useEffect(() => {
    if (!isClient) return;

    const updateWidth = () => {
      if (wrapperRef.current) {
        const width = wrapperRef.current.clientWidth;
        setSliderWidth(width);
        //console.log("updateWidth:", width);
      }
    };

    const handleResize = () => {
      setIsXs(getBreakpointState("xs"));
      setIsSm(getBreakpointState("sm"));
      setIsMd(getBreakpointState("md"));
      setIsLg(getBreakpointState("lg"));
      setIsXl(getBreakpointState("xl"));
      updateWidth();
    };

    
    let observer: ResizeObserver | null = null;
    if (wrapperRef.current) {
      observer = new ResizeObserver(() => {
        updateWidth();
      });
      observer.observe(wrapperRef.current);
    }

    window.addEventListener("resize", handleResize);
    updateWidth();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (observer && wrapperRef.current) {
        observer.unobserve(wrapperRef.current);
      }
    };
  }, [wrapperRef, isClient,sliderWidth,itemsPerView]);

  useEffect(() => {
    if (isXl === null) return;
    const slides = isXl ? 6 : isLg ? 5 : isMd ? 4 : isSm ? 3 : 2;
    setItemsPerView(slides);
  }, [isXs, isSm, isMd, isLg, isXl]);

  return { sliderWidth, itemsPerView, isXs, isSm, isMd, isLg, isXl };
};