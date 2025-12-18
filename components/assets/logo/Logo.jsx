"use client";

import Image from "next/image";
import { useTheme } from "@/context/theme/ThemeProvider";
import { useScroll } from "@/context/scroll/ScrollingProvider";
import { usePathname } from "next/navigation";
import styles from "./logo.module.css"

const LOGO_PRIMARY = "https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFDBYWgDZxNmQAqG8cge0hkoTSVZRJ3fPUHijlp";
const LOGO_SECONDARY = "https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFD0ScouWaQFyYUIlefwhZsOdp3tLqKazo6cmbV";

export default function Logo() {
  const { theme } = useTheme();
  const { scrolling } = useScroll();
  const path = usePathname();

  const isSpecialPage = path === "/" || path.startsWith("/menu") || path.startsWith("/menu/");

  const showLogo = theme === "light" && (scrolling || !isSpecialPage);

  return (
    <Image
      src={showLogo ? LOGO_SECONDARY : LOGO_PRIMARY}
      alt="cafe logo"
      className={styles.logo}
      priority
      width={0}
      height={0}
      sizes="100%"
    />
  )
}