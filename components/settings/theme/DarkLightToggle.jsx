"use client";

import { useTheme } from "@/context/theme/ThemeProvider";
import { CiStar } from "react-icons/ci";
import { IoMdMoon, IoIosCloudy } from "react-icons/io";
import { IoSunny } from "react-icons/io5";
import styles from "./dark-light-toggle.module.css";

export default function DarkLightToggle() {
  const { theme, toggleTheme, isMounted } = useTheme();

  if (!isMounted) {
    return <div className={`${styles.modeButton} ${styles.nonMounted}`} />
  } //to pre.hydration mismatch

  const isLight = theme === "light" || !theme;

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${styles.modeButton}
        ${isLight ? styles.light : styles.dark}
      `}
    >
      <div className={styles.modeBtnContainer}>
        {[...Array(5)].map((_, i) => (
          isLight ? (
            <IoIosCloudy
              key={i}
              className={`${styles.icon} ${styles[`icon${i}`]} ${styles.lightIcon}`}
            />
          ) : (
            <CiStar
              key={i}
              className={`${styles.icon} ${styles[`icon${i}`]} `}
            />
          )
        ))}
      </div>

      {isLight
        ? <IoSunny className={styles.sun} />
        : <IoMdMoon className={styles.moon} />
      }
    </button>
  )
}