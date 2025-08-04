import dynamic from "next/dynamic";
import Link from "next/link";
import Carousel from "@/components/ui/slides/carousel/Carousel";
import {menuSlides, menuLinks} from "./menu-items";
import { menuPageitems } from "@/components/ui/sections/cards/card-items";
import orderHand from "@/public/order-hand.png";
import coffee from "@/public/cafe/coffee-noBG.png";
import coffeeBox from "@/public/cafe/coffeebox-nobgtext.png";
import styles from "./menu.module.css";
import Image from "next/image";

const HeroBanner = dynamic(() => import('@/components/ui/assets/heroBanner/HeroBanner'));
const CardsSection = dynamic(() => import('@/components/ui/sections/cards/CardsSection'));
const MenuPreview = dynamic(() => import('@/components/menu/MenuPreview'));
const Footer = dynamic(() => import('@/components/ui/sections/footer/Footer'));

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
            <div className={styles.rightImageWrapper}>
              <Image
                src={orderHand}
                alt="image"
                width={0}
                height={0}
                sizes="100%"
              />
            </div>
             <div className={styles.leftImageWrapper}>
              <Image
                src={coffeeBox}
                alt="image"
                width={0}
                height={0}
                sizes="100%"
              />
            </div>
            <h2>for a Wonderful Experience</h2>
            <div className={styles.reservation}>
              <Link href="/reservation">
                Make Reservation 
              </Link>
            </div>
            <div className={styles.blurOverlayTop}/>
            <div className={styles.blurOverlayBottom}/>
          </div>
        </div>
      </main>

      {/* for fixed footer */}
      <div style={{height: '100vh', zIndex: '-500'}} />
    </div>
      
    <div className={styles.footerWrapper}>
      <div className={styles.footer}>
        <Footer />
      </div>
    </div>
    </>
  )
}