// Menu carousel wrapper (Client Component):
// encapsulates the menu carousel with category navigation and "View All" links.

"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Carousel from "@/components/ui/slides/carousel/Carousel";
import { MenuPreview } from "@/components/menu/MenuSection";
import { useNavigation } from "@/context/navigation/NavigationProvider";
import { Leaf, Coffee, Utensils, ArrowRight } from 'lucide-react';
import styles from "./menu.module.css";

const CATEGORY_ICONS = {
  "Desserts": Leaf,
  "Drinks": Coffee,
  "Meals": Utensils,
  "Salads": Leaf,
};

export default function MenuCarousel({ menuLinks, textLabels }) {
  const router = useRouter();
  const { triggerNavigation, setIsLoading } = useNavigation();
  const [isPending, startTransition] = useTransition();

  function getMenuCategory(index) {
    const item = menuLinks[index];
    if (!item) return null;
    return Object.values(item)[0];
  }

  function handleViewAll(e, href) {
    e.preventDefault();
    setIsLoading(true);

    triggerNavigation(() => {
      startTransition(() => {
        router.push(href);
        setIsLoading(false);
      });
    });
  }

  return (
    <Carousel
      autoSlide={false}
      carouselWrapper={styles.carouselLinksWrapper}
      dotsWrapper={styles.linksWrapper}
      customDot={(index, isActive, onClick) => {
        const label = textLabels[index] || `Category ${index + 1}`;
        const Icon = CATEGORY_ICONS[label] || Leaf;

        return (
          <button
            key={index}
            onClick={onClick}
            className={`${styles.categoryPill} ${isActive ? styles.activePill : ""}`}
          >
            <Icon size={16} className={styles.categoryIcon} />
            {label}
          </button>
        );
      }}
      renderSlideFooter={(index) => {
        const category = getMenuCategory(index);
        if (!category) return null;
        return (
          <div className={styles.footerContainer}>
            <Link
              href={`menu/${category.href}`}
              onClick={(e) => handleViewAll(e, `menu/${category.href}`)}
              className={`highlight-first-button ${styles.viewAllLink}`}
            >
              View All {category.title}
              <ArrowRight size={18} className={styles.btnArrow} />
            </Link>

            <div className={styles.discoverMore}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className={styles.curvedArrow}>
                <path d="M5 10C5 10 15 5 25 15C35 25 25 35 25 35M25 35L20 30M25 35L30 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className={styles.discoverText}>
                Discover more {category.title.toLowerCase()}
              </span>
            </div>
          </div>
        );
      }}
    >
      {menuLinks.map((item, index) => {
        const itemsData = Object.values(item)[0];
        if (!itemsData) return null;
        return (
          <div key={index} className={styles.menuItemsWrapper}>
            {itemsData.menuItems.slice(0, 3).map((menuItem, i) => (
              <MenuPreview
                key={i}
                src={menuItem.image}
                description={menuItem.description}
                price={menuItem.price}
                title={menuItem.name}
                isNew={menuItem.isNew}
                variant={i === 2 ? "horizontal" : "vertical"}
              />
            ))}
          </div>
        );
      })}
    </Carousel>
  );
}
