"use client";

import { useTheme } from "@/components/providers/theme/ThemeContext";
// import { useScroll } from "@/components/providers/ScrollingContext";
import { CiStar } from "react-icons/ci";
import { IoMdMoon,IoIosCloudy } from "react-icons/io";
import { IoSunny } from "react-icons/io5";
import styles from "./DarkLightToggle.module.css";

export default function DarkLightToogle() {
  const { theme, toggleTheme, isMounted } = useTheme();
  // const { scrolling } = useScroll();
 
  if (!isMounted) {
    return <div className={styles.modeButton + " " + styles.nonMounted} />
  } //to pre.hydration mismatch

  const isLight = theme === "light" || !theme;

  // const boxShadow = {
  //   boxShadow:
  //     theme === "light" && !scrolling
  //       ? "inset 0 0 0 2px var(--text-opacity)"
  //       : "inset 0 0 0 15px var(--text-opacity)",
  // };

  return (
    <button
      onClick={toggleTheme} 
      // style={boxShadow}
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
        ? <IoSunny className={styles.sun}/> 
        : <IoMdMoon className={styles.moon}/>
      }
    </button>
  )
}