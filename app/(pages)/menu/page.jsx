import dynamic from "next/dynamic";
import Carousel from "@/components/slides/carousel/Carousel";
import {menuSlides, menuLinks} from "./menu-items";
import { MenuPreview } from "@/components/menu/MenuSection";
import styles from "./menu.module.css";

const HeroBanner = dynamic(() => import('@/components/assets/heroBanner/HeroBanner'));
const CardsSection = dynamic(() => import('@/components/sections/cards/CardsSection'));
const ReservationBanner = dynamic(() => import('@/components/assets/reservationBanner/ReservationBanner'));

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
        <div className={styles.cardsWrapper + ' ' + "mainBackground"}>
          <CardsSection menuPage={true} />
        </div>
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

        <div className={styles.contactBadgeWrapper + ' ' + "mainBackground"}>
          <div className={styles.containerBadge}>
            <ReservationBanner />
          </div>
        </div>
      </main>
    </div>
    </>
  )
}