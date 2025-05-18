"use client";

import { useTheme } from "@/components/providers/ThemeContext";
import { CiStar } from "react-icons/ci";
import { IoMdMoon,IoIosCloudy } from "react-icons/io";
import { IoSunny } from "react-icons/io5";
import styles from "./DarkLightToggle.module.css";

export default function DarkLightToogle() {

 const { theme, toggleTheme, isMounted } = useTheme();
 if (!isMounted) {
  return (
    <div className={styles.modeButton + " " + styles.nonMounted} />
  )
 } //to prevent hydration mismatch

  const isLight = theme === "light" || !theme;
  
  return (
    <button
      onClick={toggleTheme} 
      className={`
        ${styles.modeButton}
        ${isLight ? styles.light : styles.dark}
      `}
    >
      {isLight
        ? <div className={styles.modeBtnContainer}>
            {[...Array(5)].map((_, i) => (
              <IoIosCloudy
                key={i}
                className={`${styles.icon} ${styles[`icon${i}`]} ${styles.lightIcon}`}
              />
            ))}
          </div>
        : <div className={styles.modeBtnContainer}>
            {[...Array(5)].map((_, i) => (
              <CiStar
                key={i}
                className={`${styles.icon} ${styles[`icon${i}`]} `}
              />
            ))}
          </div>
      }
      {isLight
        ? <IoSunny className={styles.sun}/> 
        : <IoMdMoon className={styles.moon} />
      }
    </button>
  )
}