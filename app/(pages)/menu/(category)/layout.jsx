"use client";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import { createPortal } from "react-dom";
import FoodsIcon from "@/components/ui/icon/FoodsIcon";
import { Button } from "@/components/ui/button/Button";
import { menuLinks } from "../menu-items";
import styles from "./category.module.css";

const cx = (...classes) => classes.filter(Boolean).join(" ");

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
      <div className={cx(styles.categoryWrapper, "mainBackground")}>
        <div className="containerTopNavbarColor" />
        <div className={styles.linkWrapper}>
          {menuLinks.map((item) => {
            const [categoryKey, itemsData] = Object.entries(item)[0] ?? [];
            if (!itemsData) return null;
            const currentCategory = pathname.split("/").pop();
            return (
              <Button
                key={categoryKey}
                type="button"
                variant="plain"
                onClick={() => handleLinkClick(`/menu/${itemsData.href}`)}
                className={cx(
                  styles.categoryLink,
                  currentCategory === itemsData.href && styles.active,
                )}
              >
                {itemsData.title}
              </Button>
            );
          })}
        </div>
        {animationPortal}
        {children}
      </div>
    </>
  );
}
