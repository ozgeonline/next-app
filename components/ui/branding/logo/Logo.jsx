// Logo component: Renders the primary application brand identity and handles home view navigation.
"use client";

import Image from "next/image";
import { useTheme } from "@/context/theme/ThemeProvider";
import { useScroll } from "@/context/scroll/ScrollingProvider";
import { usePathname } from "next/navigation";
import { useNavigation } from "@/context/navigation/NavigationProvider";
import styles from "./logo.module.css"

const LOGO_LIGHT = "https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFDBYWgDZxNmQAqG8cge0hkoTSVZRJ3fPUHijlp";
const LOGO_DARK = "https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFD0ScouWaQFyYUIlefwhZsOdp3tLqKazo6cmbV";

export default function Logo() {
  const { theme } = useTheme();
  const { scrolling } = useScroll();
  const path = usePathname();
  const { isOpen } = useNavigation();

  const isSpecialPage = path === "/" || path === "/menu";

  const useLightLogo = theme === "dark" || (!isOpen && !scrolling && isSpecialPage);

  const currentLogoSrc = useLightLogo ? LOGO_LIGHT : LOGO_DARK;

  return (
    <Image
      src={currentLogoSrc}
      alt="cafe logo"
      className={styles.logo}
      priority
      width={0}
      height={0}
      sizes="100%"
    />
  )
}