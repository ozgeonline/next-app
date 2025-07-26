'use client';

import { useEffect, useRef, useState } from 'react';

export default function ScrollToSection({ children, isVisible, setIsVisible, className }) {
  const sectionRef = useRef(null);
  const lastScrollY = useRef(0);
  const scrollingDown = useRef(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  //console.log("scrollingDown", scrollingDown);

  //visibility & reset hasScrolled
  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const { isIntersecting, boundingClientRect: rect, rootBounds } = entry;
        //const scrollY = window.scrollY;
        //const elementTopRelativeToDocument = scrollY + rect.top;

        // **debugging
        // console.log('IntersectionObserver:', {
        //   scrollY,
        //   elementTop: rect.top,
        //   elementBottom: rect.bottom,
        //   elementHeight: rect.height,
        //   elementTopRelativeToDocument,
        //   scrollingDown:  scrollingDown.current
        //   rootBoundsHeight: rootBounds.height,
        // });

        if (
          !isIntersecting && 
          !scrollingDown.current && 
          rootBounds && 
          rect.bottom > rootBounds.height
        ) {
          //console.log('Resetting hasScrolled');
          setHasScrolled(false);
        }
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

  //scroll direction
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollingDown.current = currentScrollY > lastScrollY.current;
      lastScrollY.current = currentScrollY;
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  //trigger scroll
  useEffect(() => {
    if (
      !isVisible &&
      sectionRef.current &&
      scrollingDown.current &&
      !hasScrolled 
    ) {
      //console.log('Triggering scrollIntoView');
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setHasScrolled(true);
    }
  }, [isVisible, hasScrolled]);

  return <div className={className} style={{zIndex: 1}} ref={sectionRef}>{children}</div>;
}