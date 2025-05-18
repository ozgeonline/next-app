"use client";

import { createContext, useContext, useEffect, useState } from "react";
import styles from "@/components/navbar/navbar.module.css";

const ScrollContext = createContext();

export function ScrollProvider({ children }) {
  const [scrolling, setScrolling] = useState(false);
  // console.log("Scrolling:", scrolling);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 10);
      //console.log("ScrollY:", window.scrollY);
    };
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ScrollContext.Provider value={{ scrolling }}>
      <div
        className={`${styles.container} ${scrolling ? styles.navbarScroll : ""}`}
      >
        {children}
      </div>
    </ScrollContext.Provider>
  );
}

export function useScroll() {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScroll must be used within a ScrollProvider");
  }
  return context;
}

