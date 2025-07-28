import HeroBanner from "@/components/ui/assets/heroBanner/HeroBanner";
import Footer from "@/components/ui/sections/footer/Footer";
import styles from "./menu.module.css";
export default function MenuPage() {
  return (
    <>
    <div className={styles.container}>
      <HeroBanner srcImage="https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFDMrKaB2nlPGFDafBuW154icVrsNKdbwvp82nJ"/>
      <main className={styles.menu}>
        Menu
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