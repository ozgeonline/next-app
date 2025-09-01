"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition, useRef } from "react";
import { createPortal } from "react-dom";
import FoodsIcon from "@/components/ui/icon/FoodsIcon";
import { menuLinks } from "../menu-items";
import styles from "./category.module.css";
import TopScrollButton from "@/components/ui/actions/topScrollButton/TopScrollButton";
export default function RootLayout({ children }) {
  const router = useRouter();
  const scrollRef = useRef(null); 
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
    <div ref={scrollRef} className={styles.categoryWrapper + ' ' + "mainBackground"}>
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
        <TopScrollButton scrollRef={scrollRef}/>
    </div>
    </>
  );
}