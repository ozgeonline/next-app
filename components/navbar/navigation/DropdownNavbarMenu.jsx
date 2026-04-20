"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/context/theme/ThemeProvider";
import { useNavbarScroll } from "@/hooks/useNavbarScroll";
import { useNavigation } from "@/context/navigation/NavigationProvider";
import { usePathname } from "next/navigation";
import MenuIcon from "@/components/ui/icon/MenuIcon";
import FoodsIcon from "@/components/ui/icon/FoodsIcon";
import styles from "./dropdown.module.css";

export default function DropdownNavbarMenu({ children }) {
  const dropdownRef = useRef(null);
  const { theme } = useTheme();
  const scrolling = useNavbarScroll();
  const { isOpen, setIsOpen } = useNavigation();
  const pathname = usePathname();

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

  const hasDarkHero = pathname === "/" || pathname === "/menu";
  const background = { background: "var(--background)" };
  const menuIcon = { color: isOpen === true && "var(--text)" }

  const strokeColor =
    theme === "light" && !scrolling && hasDarkHero
      ? "#f4f4f9"
      : "var(--text)";

  return (
    <div ref={dropdownRef}>
      <MenuIcon
        onClick={() => setIsOpen(!isOpen)}
        open={isOpen}
        style={menuIcon}
      />

      {isOpen &&
        <div
          className={styles.dropdown}
          style={background}
        >
          {children}
          <div className={styles.iconWrapper}>
            <FoodsIcon stroke={strokeColor} width="100%" />
          </div>
        </div>
      }
    </div>
  )
}