"use client";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import { createPortal } from "react-dom";
import FoodsIcon from "@/components/ui/icon/FoodsIcon";
import { menuLinks } from "../menu-items";
import styles from "./category.module.css";

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLinkClick = (href) => {
    startTransition(() => {
      router.push(href);
    });
  };

  const animationPortal = isPending
    ? createPortal(
        <div className={styles.overlay}>
          <FoodsIcon stroke="white" className={styles.icon} width="50%" />
        </div>,
        document.body
      )
    : null;

  return (
    <>
    <div className={styles.categoryWrapper + ' ' + "mainBackground"}>
      <div className="containerTopNavbarColor"/>
        <div className={styles.linkWrapper}>
          {menuLinks.map((item,index) => {
            const itemsData = item.desserts || item.drinks  || item.meals || item.salads;
            if (!itemsData) return null;
            const currentCategory = pathname.split("/").pop();
            //console.log("currentCategory:", currentCategory);
            return (
              <button
                key={index}
                onClick={() => handleLinkClick(`/menu/${itemsData.href}`)}
                className={currentCategory === itemsData.href ? styles.active : ""}
              >
                {itemsData.title}
              </button>
            );
          })}
        </div>
        {animationPortal}
        {children}
    </div>
    </>
  );
}