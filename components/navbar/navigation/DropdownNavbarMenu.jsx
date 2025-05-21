"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/components/providers/ThemeContext";
import { useScroll } from "@/components/providers/ScrollingContext";
import styles from "./dropdown.module.css";
import MenuIcon from "./MenuIcon";

export default function DropdownNavbarMenu({children}) {
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  const { scrolling } = useScroll();

   const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  const background = {
    background:
      theme === "light" && !scrolling
        ? "#1A1A1A"
        :  "var(--background)",
  };

  useEffect(() => {
    const handleScroll = () => {
      if (open) {
        setOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  return (
    <div ref={dropdownRef}>
      <MenuIcon onClick={() => setOpen(!open)} open={open} />
        {open && 
          <div
            className={styles.dropdown}
            style={background}
          >
            {children}
          </div>
        }
    </div>
  )
}