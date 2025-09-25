"use client";

import Link from "next/link";
import { useEffect, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useNavigation } from "@/context/navbar/NavigationContext";
import { useScroll } from "@/context/navbar/ScrollingContext";
import styles from "./nav-link.module.css";

export default function NavLink({href, children}) {
  const path = usePathname();
  const router = useRouter();
  const { scrolling } = useScroll();
  const { setIsOpen,isOpen, triggerNavigation, setIsLoading } = useNavigation();
  const [isPending, startTransition] = useTransition();
  
  const linkStyle = {
    color:
      !scrolling
        ? "#FFFFFF"
        :  "var(--shark-800)"
  };

 const handleClick = (e) => {
    e.preventDefault();
    // console.log(`isOpen: ${isOpen}, href: ${href}, current path: ${path}`);
    if (href === path) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(false);

    //trigger transition
    triggerNavigation(() => {
      startTransition(() => {
        router.push(href);
        setIsLoading(false);
      });
    });
  };

  //reset loading state
  useEffect(() => {
    if (!isPending && !isOpen) {
      setIsLoading(false);
    }
  }, [isPending, isOpen, setIsLoading]);

  return (
    <Link
      href={href}
      className={path === `${href}` ? styles.active : ""}
      style={linkStyle}
      onClick={handleClick}
    >
      {children}
    </Link>
  )
}