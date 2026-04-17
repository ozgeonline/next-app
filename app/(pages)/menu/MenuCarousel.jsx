// Menu carousel wrapper (Client Component):
// encapsulates the menu carousel with category navigation and "View All" links.

"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Carousel from "@/components/ui/slides/carousel/Carousel";
import { MenuPreview } from "@/components/menu/MenuSection";
import { useNavigation } from "@/context/navigation/NavigationProvider";
import styles from "./menu.module.css";

export default function MenuCarousel({ menuLinks, textLabels }) {
  const router = useRouter();
  const { triggerNavigation, setIsLoading } = useNavigation();
  const [isPending, startTransition] = useTransition();

  function getMenuCategory(index) {
    const item = menuLinks[index];
    if (!item) return null;
    return item.desserts || item.drinks || item.meals || item.salads;
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
      dotType="text"
      textLabels={textLabels}
      carouselWrapper={styles.carouselLinksWrapper}
      dotsWrapper={styles.linksWrapper}
      renderSlideFooter={(index) => {
        const category = getMenuCategory(index);
        if (!category) return null;
        return (
          <Link
            href={`menu/${category.href}`}
            onClick={(e) => handleViewAll(e, `menu/${category.href}`)}
            className={`accent-link-button ${styles.viewAllLink}`}
          >
            View All {category.title}
          </Link>
        );
      }}
    >
      {menuLinks.map((item, index) => {
        const itemsData = item.desserts || item.drinks || item.meals || item.salads;
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
              />
            ))}
          </div>
        );
      })}
    </Carousel>
  );
}
