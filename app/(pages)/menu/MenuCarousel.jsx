"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Carousel from "@/components/ui/slides/carousel/Carousel";
import { MenuPreview } from "@/components/menu/MenuSection";
import { useNavigation } from "@/context/navigation/NavigationProvider";
import { Button } from "@/components/ui/button/Button";
import { ArrowRight, Coffee, Leaf, SearchX, Utensils } from "lucide-react";
import styles from "./menu.module.css";

const CATEGORY_ICONS = {
  Desserts: Leaf,
  Drinks: Coffee,
  Meals: Utensils,
  Salads: Leaf,
};

const cx = (...classes) => classes.filter(Boolean).join(" ");

export default function MenuCarousel({
  menuLinks,
  textLabels,
  filteredItems = [],
  hasActiveFilters = false,
  onResetFilters,
}) {
  const router = useRouter();
  const { triggerNavigation, setIsLoading } = useNavigation();
  const [, startTransition] = useTransition();

  function getMenuCategory(index) {
    const item = menuLinks[index];
    if (!item) return null;
    return Object.entries(item)[0]?.[1] ?? null;
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

  if (hasActiveFilters) {
    return (
      <section className={styles.filteredMenuSection}>
        <div className={styles.filteredHeader}>
          <div>
            <h2>Filtered Menu</h2>
            <p>{filteredItems.length} item{filteredItems.length === 1 ? "" : "s"} found</p>
          </div>
          <Button
            type="button"
            variant="plain"
            className={styles.clearFiltersButton}
            onClick={onResetFilters}
          >
            Clear filters
          </Button>
        </div>

        {filteredItems.length > 0 ? (
          <div className={styles.filteredGrid}>
            {filteredItems.map((menuItem) => (
              <MenuPreview
                key={`${menuItem.categoryKey}-${menuItem.name}`}
                src={menuItem.image}
                description={menuItem.description}
                price={menuItem.price}
                title={menuItem.name}
                isNew={menuItem.isNew}
                variant="vertical"
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyFilterState}>
            <SearchX size={34} />
            <p>No menu items match your filters.</p>
          </div>
        )}
      </section>
    );
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
          <Button
            key={label}
            type="button"
            variant="plain"
            onClick={onClick}
            className={cx(styles.categoryPill, isActive && styles.activePill)}
            iconLeft={<Icon size={16} />}
          >
            {label}
          </Button>
        );
      }}
      renderSlideFooter={(index) => {
        const category = getMenuCategory(index);
        if (!category) return null;
        const href = `/menu/${category.href}`;

        return (
          <div className={styles.footerContainer}>
            <Button
              href={href}
              onClick={(event) => handleViewAll(event, href)}
              variant="primary"
              className={styles.viewAllLink}
              iconRight={<ArrowRight size={18} className={styles.btnArrow} />}
            >
              View All {category.title}
            </Button>

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
      {menuLinks.map((item) => {
        const [categoryKey, itemsData] = Object.entries(item)[0] ?? [];
        if (!itemsData) return null;
        return (
          <div key={categoryKey} className={styles.menuItemsWrapper}>
            {itemsData.menuItems.slice(0, 3).map((menuItem, index) => (
              <MenuPreview
                key={menuItem.name}
                src={menuItem.image}
                description={menuItem.description}
                price={menuItem.price}
                title={menuItem.name}
                isNew={menuItem.isNew}
                variant={index === 2 ? "horizontal" : "vertical"}
              />
            ))}
          </div>
        );
      })}
    </Carousel>
  );
}
