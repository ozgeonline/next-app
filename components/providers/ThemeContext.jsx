"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  //default local theme
  const getInitialTheme = () => {
    if (typeof window !== "undefined") {
      try {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
          return savedTheme;
        }
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        return prefersDark ? "dark" : "light";
      } catch (e) {
        return "light"; //for local
      }
    }
    return "light";//for server side
  };

  const [theme, setTheme] = useState("light");
  const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
    const getInitialTheme = () => {
      try {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
          return savedTheme;
        }
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        return prefersDark ? "dark" : "light";
      } catch (e) {
        return "light";
      }
    };

    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
    setIsMounted(true);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (!localStorage.getItem("theme")) {
        const newTheme = mediaQuery.matches ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    if (typeof document !== "undefined") {
      const newTheme = theme === "light" ? "dark" : "light";
      setTheme(newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    };
  }

  // if (!isMounted ) {
  //   document.documentElement.setAttribute("data-theme", theme);
  // }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isMounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}