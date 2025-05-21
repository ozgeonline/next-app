"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/providers/ThemeContext";
import { useScroll } from "@/components/providers/ScrollingContext";
import styles from "./nav-link.module.css";
export default function NavLink({href, children}) {
  const path = usePathname();
  const { theme } = useTheme();
  const { scrolling } = useScroll();
  
  const iconItemStyle = {
    color:
      theme === "light" && !scrolling
        ? "#FFFFFF"
        :  "var(--text)",
    
  };

  return (
    <Link
      href={href}
      className={path === `${href}` ? styles.active : ""}
      style={iconItemStyle}
    >
      {children}
    </Link>
  )
}