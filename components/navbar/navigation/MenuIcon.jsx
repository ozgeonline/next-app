"use client";

import { useTheme } from "@/components/providers/ThemeContext";
import { useScroll } from "@/components/providers/ScrollingContext";
import styles from "./dropdown.module.css";
export default function MenuIcon({onClick, open}) {
  const { theme } = useTheme();
  const { scrolling } = useScroll();

  const iconItemStyle = {
    backgroundColor:
      theme === "light" && !scrolling
        ? "#FFFFFF"
        :  "var(--text)",
  };

  const openMenu = () => {
    return (
      <>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={styles.icon  + " " + styles.iconOpen }
            style={iconItemStyle}
          ></div>
        ))}
      </>
    )
  }

  const closeMenu = () => {
    return (
      <>
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className={styles.icon + " " + styles.iconClose}
            style={iconItemStyle}
          ></div>
        ))}
      </>
    )
  }

  return (
    <div className={styles.menuIcon} onClick={onClick}>
      {!open ? openMenu() : closeMenu()}
    </div>
  )
}