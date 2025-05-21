"use client";

import { useState, useEffect } from "react";

const breakpointConditions = {
  xs: (width) => width < 640,
  sm: (width) => width >= 640 && width < 768,
  md: (width) => width >= 768 && width < 1024,
  lg: (width) => width >= 1024 && width < 1280,
  xl: (width) => width >= 1280,
};

export const BreakpointSettings = (wrapperRef) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(2);
  //console.log("sliderWidth", sliderWidth);

  const isClient = typeof window !== "undefined";

  const getBreakpointState = (breakpoint) => {
    if (!isClient) return false;
    const condition = breakpointConditions[breakpoint];
    return condition ? condition(window.innerWidth) : false;
  };

  const [isXs, setIsXs] = useState(null);
  const [isSm, setIsSm] = useState(null);
  const [isMd, setIsMd] = useState(null);
  const [isLg, setIsLg] = useState(null);
  const [isXl, setIsXl] = useState(null);

  useEffect(() => {
    if (!isClient) return;

    const handleResize = () => {
      setIsXs(getBreakpointState("xs"));
      setIsSm(getBreakpointState("sm"));
      setIsMd(getBreakpointState("md"));
      setIsLg(getBreakpointState("lg"));
      setIsXl(getBreakpointState("xl"));

      if (wrapperRef.current) {
        setSliderWidth(wrapperRef.current.clientWidth);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [wrapperRef, isClient]);

  useEffect(() => {
      if (isXl === null) return;
    const slides = isXl ? 6 : isLg ? 5 : isMd ? 4 : isSm ? 3 : 2;
    setItemsPerView(slides);
  }, [isXs,isSm, isMd, isLg, isXl]);

  return { sliderWidth, itemsPerView, isXs, isSm, isMd, isLg, isXl };
};