"use client";

import Image from "next/image";
import { useTheme } from "@/components/providers/ThemeContext";
import { useScroll } from "@/components/providers/ScrollingContext";
import darkModeLogo from "@/public/logoDarkMode.svg";
import lightModeLogo from "@/public/logoLightMode.svg";
import styles from "./logo.module.css"
export default function Logo() {
  const { theme } = useTheme();
  const {scrolling} = useScroll();
   //console.log("scrolling", scrolling);

  return (
    <Image
      src={
        theme === "light" && !scrolling
        ? darkModeLogo 
        : theme === "light" && scrolling 
        ? lightModeLogo 
        : darkModeLogo
      }
      alt="cafe logo"
      className={styles.logo}
      priority
    />
  )
}