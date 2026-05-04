"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { ChefHat, Heart, Leaf, Users } from "lucide-react";
import Carousel from "@/components/ui/slides/carousel/Carousel";
import { menuSlides, menuLinks } from "./menu-items";
import { menuPageitemsBottom } from "@/components/sections/highlight-cards/card-items";
import MenuCarousel from "./MenuCarousel";
import WavesBackground from "@/components/ui/backgrounds/wavesBackground/WavesBackground";
import FeaturesStrip from "@/components/sections/features-strip/FeaturesStrip";
import MenuHeroSearch from "@/components/menu/menu-hero-search/MenuHeroSearch";
import styles from "./menu.module.css";

const HeroBanner = dynamic(() => import("@/components/ui/banners/hero-banner/HeroBanner"));
const HighlightCards = dynamic(() => import("@/components/sections/highlight-cards/HighlightCards"));
const MainPageReservationBanner = dynamic(() => import("@/components/ui/banners/reservation-banner/MainPageReservationBanner"));

const menuFeatures = [
  { icon: Leaf, title: "Fresh Ingredients", description: "Sourced daily, made with care." },
  { icon: ChefHat, title: "Expertly Crafted", description: "Perfectly prepared by chefs." },
  { icon: Heart, title: "Healthy & Delicious", description: "Good for your body and soul." },
  { icon: Users, title: "Made for Sharing", description: "Great food, great moments." },
];

function normalize(value) {
  return value.toLowerCase().trim();
}

export default function MenuPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newOnly, setNewOnly] = useState(false);

  const filteredItems = useMemo(() => {
    const query = normalize(searchQuery);

    return menuLinks.flatMap((categoryEntry) => {
      const [categoryKey, categoryData] = Object.entries(categoryEntry)[0] ?? [];
      if (!categoryData) return [];

      const categoryMatches = selectedCategory === "All" || categoryData.title === selectedCategory;
      if (!categoryMatches) return [];

      return categoryData.menuItems
        .filter((menuItem) => {
          const text = normalize(`${menuItem.name} ${menuItem.description} ${categoryData.title}`);
          const queryMatches = !query || text.includes(query);
          const newMatches = !newOnly || menuItem.isNew;
          return queryMatches && newMatches;
        })
        .map((menuItem) => ({
          ...menuItem,
          categoryKey,
          categoryTitle: categoryData.title,
          categoryHref: categoryData.href,
        }));
    });
  }, [newOnly, searchQuery, selectedCategory]);

  const hasActiveFilters = Boolean(searchQuery.trim()) || selectedCategory !== "All" || newOnly;

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setNewOnly(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.heroSectionWrapper}>
        <Carousel
          data-theme="dark"
          autoSlide={true}
          carouselWrapper={styles.carouselSlideWrapper}
          dotsWrapper={styles.dotsWrapper}
        >
          {menuSlides.map((item) => {
            const [slideKey, itemsData] = Object.entries(item)[0] ?? [];
            if (!itemsData) return null;

            return (
              <HeroBanner
                key={slideKey}
                srcImage={itemsData.src}
                introductionTitle={itemsData.title}
                introduction={itemsData.description}
                variant="menu"
                label={itemsData.label}
                icon={itemsData.icon}
                highlightWord={itemsData.highlightWord}
              />
            );
          })}
        </Carousel>

        <div className={styles.featuresOverlay} data-theme="dark">
          <FeaturesStrip items={menuFeatures} />
        </div>
      </div>

      <main className={styles.main}>

        <div className={`${styles.menu} mainBackground`}>
          <MenuHeroSearch
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            newOnly={newOnly}
            resultCount={filteredItems.length}
            onSearchChange={setSearchQuery}
            onCategoryChange={setSelectedCategory}
            onNewOnlyChange={setNewOnly}
            onReset={resetFilters}
          />
          <WavesBackground />
          <MenuCarousel
            menuLinks={menuLinks}
            textLabels={["Desserts", "Drinks", "Meals", "Salads"]}
            filteredItems={filteredItems}
            hasActiveFilters={hasActiveFilters}
            onResetFilters={resetFilters}
          />
        </div>

        <div className={`${styles.contactBadgeWrapper} mainBackground`}>
          <MainPageReservationBanner />
        </div>

        <div className={`${styles.cardsWrapper} mainBackground`}>
          <HighlightCards data={menuPageitemsBottom} learnMore={true} />
        </div>
      </main>
    </div>
  );
}
