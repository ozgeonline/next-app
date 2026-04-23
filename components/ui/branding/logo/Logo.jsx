"use client";

import Link from "next/link";
import { useTheme } from "@/context/theme/ThemeProvider";
import { useNavbarScroll } from "@/hooks/useNavbarScroll";
import { usePathname } from "next/navigation";
import { useNavigation } from "@/context/navigation/NavigationProvider";
import styles from "./logo.module.css";

export default function Logo() {
  const { theme } = useTheme();
  const scrolling = useNavbarScroll();
  const path = usePathname();
  const { isOpen } = useNavigation();

  const isSpecialPage = path === "/" || path === "/menu";
  const useLightLogo = theme === "dark" || (!isOpen && !scrolling && isSpecialPage);

  const vectorColor = useLightLogo ? "#ffffff" : "#1a1a1a";
  const circleColor = theme === "dark" ? "#ffffc2" : "#f3418a";

  return (
    <Link href="/" className={styles.logoContainer} style={{ color: vectorColor }}>
      <svg
        viewBox="0 0 130 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.svgVector}
      >
        <g transform="translate(0, 5)">
          {/* Soft App-Icon Style Background Plate */}
          <rect x="0" y="0" width="30" height="30" rx="10" fill="currentColor" fillOpacity="0.08" />

          {/* Symmetrical Modern Fork */}
          <path
            d="M 8 8 L 8 13 C 8 16 14 16 14 13 L 14 8 M 11 8 L 11 23"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Knife */}
          <path
            d="M 22 8 C 22 8 18 12 18 16 L 22.5 16 Z"
            fill="currentColor"
          />
          <path
            d="M 21.5 17 L 21.5 23"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>

        {/* Clean, Elegant Typography */}
        <text
          x="38"
          y="28"
          fill="currentColor"
          fontFamily="inherit"
          fontSize="23"
          fontWeight="700"
          letterSpacing="-0.3"
        >
          online
        </text>

        <circle cx="107" cy="28" r="3.5" fill={circleColor} />
      </svg>
    </Link>
  );
}