"use client";

import Image from "next/image";
import { useTheme } from "@/components/providers/theme/ThemeContext";
import { useScroll } from "@/components/providers/navbar/ScrollingContext";
import styles from "./logo.module.css"
export default function Logo() {
  const { theme } = useTheme();
  const {scrolling} = useScroll();
   //console.log("scrolling", scrolling);

  return (
    <Image
      src={
        theme === "light" && !scrolling
        ? "https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFDBYWgDZxNmQAqG8cge0hkoTSVZRJ3fPUHijlp"
        : theme === "light" && scrolling 
        ? "https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFD0ScouWaQFyYUIlefwhZsOdp3tLqKazo6cmbV"
        : "https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFDBYWgDZxNmQAqG8cge0hkoTSVZRJ3fPUHijlp"
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