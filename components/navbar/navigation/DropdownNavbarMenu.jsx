"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/providers/theme/ThemeContext";
import { useScroll } from "@/components/providers/navbar/ScrollingContext";
import { useNavigation } from "@/components/providers/navbar/NavigationContext";
import MenuIcon from "@/components/ui/icon/MenuIcon";
import FoodsIcon from "@/components/ui/icon/FoodsIcon";
import styles from "./dropdown.module.css";

export default function DropdownNavbarMenu({children}) {
  const dropdownRef = useRef(null);
  const { theme } = useTheme();
  const { scrolling } = useScroll();
  const {isOpen, setIsOpen} = useNavigation();

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

   useEffect(() => {
    if (typeof document !== "undefined") {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isOpen]);

  const background = {
    background:
      theme === "light" && !scrolling
        ? "#1A1A1A"
        :  "var(--background)"
  };

  const border = {
    border: 
      theme === "light" && scrolling ? "1px solid #1A1A1A"
        : theme === "light" && !scrolling ? "1px solid #f4f4f9" : 
        "1px solid #f4f4f9"

  };

  const strokeColor = 
    theme === "light" && scrolling ? "#1A1A1A"
      : theme === "light" && !scrolling ? "#f4f4f9" : 
      "#f4f4f9"
    

  return (
    <div ref={dropdownRef}>
      <MenuIcon onClick={() => setIsOpen(!isOpen)} open={isOpen} className={styles.menuIcon}/>
        {isOpen && 
          <div
            className={styles.dropdown}
            style={background}
          >
            {children}
            <div className={styles.iconWrapper}>
              <FoodsIcon stroke={strokeColor} width="100%"/>
            </div>
          </div>
        }
    </div>
  )
}