"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import FoodsIcon from "@/components/ui/icon/FoodsIcon";
import { menuLinks } from "../menu-items";
import styles from "./category.module.css";
export default function RootLayout({ children }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const animationPortal = isPending && isClient
    ? createPortal(
        <div className={styles.overlay}>
          <FoodsIcon stroke="white" className={styles.icon} width="50%" />
        </div>,
        document.body
      )
    : null;

  const handleLinkClick = (href) => {
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <>
    <div className={styles.categoryWrapper + ' ' + "mainBackground"}>
      <div className={styles.containerTopNavbar} />
        <div className={styles.linkWrapper}>
          {menuLinks.map((item, index) => {
          const itemsData = item.desserts || item.drinks  || item.meals || item.salads;
            if (!itemsData) return null;
            return (
              <button
                key={index}
                onClick={() => handleLinkClick(itemsData.href)}
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