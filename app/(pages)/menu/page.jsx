// Menu page (Server Component):
// displays the restaurant menu with carousel banners, categorized items, and reservation section.

import dynamic from "next/dynamic";
import Carousel from "@/components/ui/slides/carousel/Carousel";
import { menuSlides, menuLinks } from "./menu-items";
import { menuPageitemsBottom } from "@/components/sections/cards/card-items";
import MenuCarousel from "./MenuCarousel";
import styles from "./menu.module.css";

const HeroBanner = dynamic(() => import('@/components/assets/heroBanner/HeroBanner'));
const CardsSection = dynamic(() => import('@/components/sections/cards/CardsSection'));
const ReservationBanner = dynamic(() => import('@/components/assets/reservationBanner/ReservationBanner'));

export const metadata = {
  title: "Menu | TasteShare",
  description: "Discover our creative menu of original recipes — desserts, drinks, meals, and salads — served fresh in our restaurant.",
  keywords: ["menu", "restaurant", "desserts", "drinks", "meals", "salads", "TasteShare"],
  openGraph: {
    title: "Menu | TasteShare",
    description: "Explore our freshly crafted dishes inspired by community recipes.",
    type: "website",
  },
};

export default function MenuPage() {
  return (
    <div className={styles.container}>
      <Carousel
        autoSlide={true}
        carouselWrapper={styles.carouselSlideWrapper}
        dotsWrapper={styles.dotsWrapper}
      >
        {menuSlides.map((item, index) => {
          const itemsData = item.cake || item.order || item.salads || item.meals;
          if (!itemsData) return null;
          return (
            <HeroBanner
              key={index}
              srcImage={itemsData.src}
              introductionTitle={itemsData.title}
              introduction={itemsData.description}
            />
          );
        })}
      </Carousel>

      <main className={styles.main}>
        <div className={`${styles.menu} mainBackground`}>
          <h2>Menu</h2>
          <MenuCarousel
            menuLinks={menuLinks}
            textLabels={["Desserts", "Drinks", "Meals", "Salads"]}
          />
        </div>

        <div className={`${styles.contactBadgeWrapper} mainBackground`}>
          <div className={styles.containerBadge}>
            <ReservationBanner />
          </div>
        </div>

        <div className={`${styles.cardsWrapper} mainBackground`}>
          <CardsSection data={menuPageitemsBottom} learnMore={true} />
        </div>

      </main>
    </div>
  )
}