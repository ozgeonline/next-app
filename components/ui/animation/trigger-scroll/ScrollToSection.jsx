'use client';

import { useEffect, useRef, useState } from 'react';

export default function ScrollToSection({ children, isVisible, setIsVisible, className }) {
  const sectionRef = useRef(null);

  // Keep track of scroll direction without triggering React re-renders
  const lastScrollY = useRef(0);
  const scrollingDown = useRef(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Manage intersection visibility and reset scrolling lock
  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const { isIntersecting, boundingClientRect: rect, rootBounds } = entry;

        // Reset the scroll lock when we scroll back up out of the section
        if (
          !isIntersecting &&
          !scrollingDown.current &&
          rootBounds &&
          rect.bottom > rootBounds.height
        ) {
          setHasScrolled(false);
        }

        // Notify parent of visibility changes safely
        setIsVisible(isIntersecting);
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: '48px 0px 0px 0px',
      }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [setIsVisible]);

  // High-performance scroll direction listener
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let ticking = false;

    // The actual calculation happens here asynchronously
    const updateScrollDir = () => {
      const currentScrollY = window.scrollY;
      scrollingDown.current = currentScrollY > lastScrollY.current;
      lastScrollY.current = currentScrollY;
      ticking = false;
    };

    // The event listener only requests an animation frame if one isn't already queued.
    // This entirely removes the heavy CPU usage.
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    // Initialize the starting position
    lastScrollY.current = window.scrollY;

    // Use { passive: true } to tell the browser this listener won't cancel scroll physics (mobile friendly)
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trigger smooth scroll into view
  useEffect(() => {
    // Only hijack the scroll if we are scrolling down towards it
    // and it hasn't been triggered yet.
    if (
      !isVisible &&
      sectionRef.current &&
      scrollingDown.current &&
      !hasScrolled
    ) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setHasScrolled(true);
    }
  }, [isVisible, hasScrolled]);

  return (
    <div className={className} style={{ zIndex: 1 }} ref={sectionRef}>
      {children}
    </div>
  );
}