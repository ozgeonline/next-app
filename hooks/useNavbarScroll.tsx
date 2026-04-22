"use client";

import { useEffect, useState } from "react";

/**
 * Provides a primitive boolean state `scrolling`, determining if the user has 
 * scrolled past a given threshold (default 10px).
 */
export function useNavbarScroll() {
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 10);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrolling;
}
