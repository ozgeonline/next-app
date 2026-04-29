"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { links } from "../navlinks.constant";
import { useNavigation } from "@/context/navigation/NavigationProvider";
import { useTheme } from "@/context/theme/ThemeProvider";
import MenuIcon from "@/components/ui/icon/MenuIcon";
import FoodsIcon from "@/components/ui/icon/FoodsIcon";
import styles from "./dropdown.module.css";

export default function DropdownNavbarMenu() {
  const dropdownRef = useRef(null);
  const { isOpen, setIsOpen } = useNavigation();
  const pathname = usePathname();
  const { theme } = useTheme();

  const isLight = theme === "light"

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isOpen]);

  const background = { background: "var(--background)" };
  const menuIcon = { color: isOpen === true && "var(--text)" }
  const foodsIcon = isLight ? "var(--razzmatazz-500)" : "var(--fuego-400)";

  return (
    <div ref={dropdownRef}>
      <MenuIcon
        onClick={() => setIsOpen(!isOpen)}
        open={isOpen}
        style={menuIcon}
      />

      {isOpen &&
        <div
          className={styles.dropdown}
          style={background}
        >
          <div className={styles.menuContainer}>
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`${styles.menuItem} ${isActive ? styles.activeItem : ""}`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className={styles.itemLeft}>
                    <link.icon size={20} className={styles.itemIcon} />
                    <span className={styles.itemName}>{link.name}</span>
                    {isActive && <span className={styles.activeDot}></span>}
                  </div>
                  <ChevronRight size={18} className={styles.chevron} />
                </Link>
              );
            })}
          </div>

          <div className={styles.iconWrapper}>
            <FoodsIcon stroke={foodsIcon} width="100%" />
          </div>
        </div>
      }
    </div>
  )
}