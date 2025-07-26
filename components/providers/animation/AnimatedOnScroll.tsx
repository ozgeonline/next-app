'use client';

import { useEffect, useRef } from 'react';

interface Props {
  children: React.ReactNode;
  animationClass: string;
  className?: string;
  style?: React.CSSProperties;
  onVisibilityChange?: (visible: boolean) => void; 
}

export default function AnimatedOnScroll({ 
  children, 
  animationClass, 
  className = '', 
  style, 
  onVisibilityChange 
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        if (isVisible) {
          entry.target.classList.add(animationClass);
        } 

        if (onVisibilityChange) {
          onVisibilityChange(isVisible);
        }
      },
      { threshold: 0.2}
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [animationClass]);

  return (
    <div
      ref={ref}
      className={`${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
