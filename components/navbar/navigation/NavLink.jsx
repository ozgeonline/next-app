"use client";

import { useEffect, useTransition, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useNavigation } from "@/context/navigation/NavigationProvider";
import { useScroll } from "@/context/scroll/ScrollingProvider";
import styles from "./nav-link.module.css";

export default function NavLink({href, children}) {
  const path = usePathname();
  const router = useRouter();
  const { scrolling } = useScroll();
  const { setIsOpen, triggerNavigation, setIsLoading } = useNavigation();
  const [isPending, startTransition] = useTransition();
  const isMountedRef = useRef(true);

  const isActive = href === "/" ? path === "/" : path.startsWith(href);
  const linkStyle = { color: !scrolling ? "#FFFFFF" :  "var(--shark-800)"};

 const handleClick = (e) => {
    e.preventDefault();
    // console.log(`isOpen: ${isOpen}, href: ${href}, current path: ${path}`);
    if (href === path) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);

    //trigger transition
    triggerNavigation(() => {
      startTransition(() => {
        router.push(href);
        setIsLoading(false);
      });
    });
  };

  // reset loading when transition completes
  useEffect(() => {
    if (!isPending && isMountedRef.current ) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isPending, setIsLoading, path]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return (
    <Link
      href={href}
      className={isActive ? styles.active : ""}
      style={linkStyle}
      onClick={handleClick}
    >
      {children}
    </Link>
  )
}