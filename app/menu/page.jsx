import dynamic from "next/dynamic";
import Carousel from "@/components/ui/slides/carousel/Carousel";
import {menuSlides, menuLinks} from "./menu-items";
import { menuPageitems } from "@/components/ui/sections/cards/card-items";
import styles from "./menu.module.css";

const HeroBanner = dynamic(() => import('@/components/ui/assets/heroBanner/HeroBanner'));
const CardsSection = dynamic(() => import('@/components/ui/sections/cards/CardsSection'));
const MenuPreview = dynamic(() => import('@/components/menu/MenuPreview'));
const ReservationBanner = dynamic(() => import('@/components/ui/assets/reservationBanner/ReservationBanner'));

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
        <div className={styles.cardsWrapper}>
          <CardsSection
            infoTitle={menuPageitems.infoCard.title}
            infoDes={menuPageitems.infoCard.description}
            imgSrc={menuPageitems.imgCard.images.src}
            imgAlt={menuPageitems.imgCard.images.alt}
            imgTitle={menuPageitems.imgCard.title}
            imgDes={menuPageitems.imgCard.description}
          />
        </div>
        <div className={styles.menu}>
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

        <div className={styles.contactBadgeWrapper}>
          <div className={styles.containerBadge}>
            <ReservationBanner />
          </div>
        </div>
      </main>
    </div>
    </>
  )
}