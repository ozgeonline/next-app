"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import FoodsIcon from "@/components/ui/icon/FoodsIcon";
import styles from "../providers.module.css";

interface ContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  triggerNavigation: (callback: () => void) => void; 
}

const NavigationContext = createContext<ContextType | undefined>(undefined);

export function NavigationProvider({ children: children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen ] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const triggerNavigation = (callback: () => void) => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    
    setIsOpen(false);
    
    timeoutRef.current = setTimeout(() => {
      if (timeoutRef.current !== null) {
        setIsLoading(true);
        callback();
        timeoutRef.current = null;
      }
    }, 500);
  };

  const animationPortal = isLoading && isMounted && typeof document !== "undefined" ? (
    createPortal(
      <div className={`${styles.overlay}`}>
        <FoodsIcon stroke="white" className={styles.icon} width="50%" />
      </div>,
      document.body
    )
  ) : null;
    
  return (
    <NavigationContext.Provider value={{
        isOpen, 
        setIsOpen,
        isLoading,
        setIsLoading,
        triggerNavigation
    }}>
      {children}
      {animationPortal}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useNavigation must be used within NavigationProvider");
  return ctx;
}
