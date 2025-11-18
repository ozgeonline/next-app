import dynamic from "next/dynamic";
import Carousel from "@/components/slides/carousel/Carousel";
import {menuSlides, menuLinks} from "./menu-items";
import { menuPageitems, menuPageitemsBottom } from "@/components/sections/cards/card-items";
import { MenuPreview } from "@/components/menu/MenuSection";
import styles from "./menu.module.css";

const HeroBanner = dynamic(() => import('@/components/assets/heroBanner/HeroBanner'));
const CardsSection = dynamic(() => import('@/components/sections/cards/CardsSection'));
const ReservationBanner = dynamic(() => import('@/components/assets/reservationBanner/ReservationBanner'));

export const metadata = {
  title: "Menu",
  description: "Discover our creative menu of original recipes served fresh in our restaurant.",
  keywords: "TasteShare, food, recipes, community"
};

export default function MenuPage() {
  return (
    <>
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
        <div className={styles.menu + ' ' + "mainBackground"}>
          <h2>Menu</h2>
          <Carousel 
            autoSlide={false}
            dotType="text"
            textLabels={["Desserts", "Drinks", "Meals", "Salads"]}
            carouselWrapper={styles.carouselLinksWrapper}
            dotsWrapper={styles.linksWrapper}
          >
            {menuLinks.map((item, index) => {
              const itemsData = item.desserts || item.drinks  || item.meals || item.salads;
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
        </div>

        {/* <div className={styles.cardsWrapper + ' ' + "mainBackground"}>
          <CardsSection data={menuPageitems}/>
        </div> */}

        <div className={styles.contactBadgeWrapper + ' ' + "mainBackground"}>
          <div className={styles.containerBadge}>
            <ReservationBanner />
          </div>
        </div>

        <div className={styles.cardsWrapper + ' ' + "mainBackground"}>
          <CardsSection data={menuPageitemsBottom} learnMore={true} />
        </div>
        
      </main>
    </div>
    </>
  )
}