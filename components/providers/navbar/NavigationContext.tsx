"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "../providers.module.css";
import dynamic from "next/dynamic";

interface ContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  triggerNavigation: (callback: () => void) => void; 
}

const NavigationContext = createContext<ContextType | undefined>(undefined);

export function NavigationProvider({ children: children }: { children: React.ReactNode }) {
  const [ isOpen, setIsOpen ] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const FoodsIcon = dynamic(() => import("@/components/ui/icon/FoodsIcon"), {
    ssr: false
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

   const triggerNavigation = (callback: () => void) => {
      setIsOpen(false);
      setTimeout(() => {
        setIsLoading(true);
        callback(); //trigger navigation
      }, 500);
  };

  const animationPortal = isLoading && isMounted && typeof document !== "undefined" ? (
    createPortal(
      <div className={`${styles.overlay}`}>
        <FoodsIcon stroke="white" className={styles.icon} style="" />
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

export const useNavigation = () => useContext(NavigationContext);