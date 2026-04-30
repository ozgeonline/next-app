import dynamic from "next/dynamic";
import { ChefHat, Heart, Leaf, Users } from "lucide-react";
import Carousel from "@/components/ui/slides/carousel/Carousel";
import { menuSlides, menuLinks } from "./menu-items";
import { menuPageitemsBottom } from "@/components/sections/highlight-cards/card-items";
import MenuCarousel from "./MenuCarousel";
import WavesBackground from "@/components/ui/backgrounds/wavesBackground/WavesBackground";
import styles from "./menu.module.css";
import FeaturesStrip from "@/components/sections/features-strip/FeaturesStrip";

const HeroBanner = dynamic(() => import("@/components/ui/banners/hero-banner/HeroBanner"));
const HighlightCards = dynamic(() => import("@/components/sections/highlight-cards/HighlightCards"));
const MainPageReservationBanner = dynamic(() => import("@/components/ui/banners/reservation-banner/MainPageReservationBanner"));

const menuFeatures = [
  { icon: Leaf, title: "Fresh Ingredients", description: "Sourced daily, made with care." },
  { icon: ChefHat, title: "Expertly Crafted", description: "Perfectly prepared by chefs." },
  { icon: Heart, title: "Healthy & Delicious", description: "Good for your body and soul." },
  { icon: Users, title: "Made for Sharing", description: "Great food, great moments." },
];

export const metadata = {
  title: "Menu | TasteShare",
  description: "Discover our creative menu of original recipes - desserts, drinks, meals, and salads - served fresh in our restaurant.",
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
          <WavesBackground />
          <MenuCarousel
            menuLinks={menuLinks}
            textLabels={["Desserts", "Drinks", "Meals", "Salads"]}
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
