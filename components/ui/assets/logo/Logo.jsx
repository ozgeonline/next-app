"use client";

import Image from "next/image";
import { useTheme } from "@/components/providers/ThemeContext";
import { useScroll } from "@/components/providers/navbar/ScrollingContext";
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
        ? "https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFD5qlLs5SzaoETPuK7Vs6q0GQmrLHRbUWgyIld"
        : theme === "light" && scrolling 
        ? "https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFDGn4ntKssNQ7uRj0YmrFpIa8zBM3JwK9SECbq" 
        : "https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFD5qlLs5SzaoETPuK7Vs6q0GQmrLHRbUWgyIld"
      }
      alt="cafe logo"
      className={styles.logo}
      priority
      width={0}
      height={0}
      sizes="100%"
    />
  )
}