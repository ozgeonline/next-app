'use client';

import { useEffect, useRef } from 'react';

interface Props {
  children: React.ReactNode;
  animationClass: string;
  className?: string;
  style?: React.CSSProperties;
  onVisibilityChange?: (visible: boolean) => void;
  triggerOnce?: boolean;
}

export default function AnimatedOnScroll({
  children,
  animationClass,
  className = '',
  style,
  onVisibilityChange,
  triggerOnce = true
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  // to prevent re-renders
  const callbackRef = useRef(onVisibilityChange);
  useEffect(() => {
    callbackRef.current = onVisibilityChange;
  }, [onVisibilityChange]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;

        if (isVisible) {
          // Trigger the entrance animation class
          entry.target.classList.add(animationClass);

          // to avoid straining the CPU, run the animation only once.
          if (triggerOnce && !callbackRef.current) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          entry.target.classList.remove(animationClass);
        }

        //notify the parent component
        if (callbackRef.current) {
          callbackRef.current(isVisible);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);

    // clean up the observer when the component unmounts
    return () => {
      observer.disconnect();
    };
  }, [animationClass, triggerOnce]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
