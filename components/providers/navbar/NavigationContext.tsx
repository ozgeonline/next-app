"use client";

import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import  FoodsIcon from "@/components/ui/icon/FoodsIcon";
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
  const [ isOpen, setIsOpen ] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

   const triggerNavigation = (callback: () => void) => {
      setIsOpen(false);
      setTimeout(() => {
        setIsLoading(true);
        callback(); //trigger navigation
      }, 500);
  };

   const animationPortal =
   isLoading && (
      createPortal(
        <div className={`${styles.overlay}`}>
          <FoodsIcon stroke="white" className={styles.icon} style="" />
        </div>,
        document.body
      )
    );
    
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