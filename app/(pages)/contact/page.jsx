import ContactForm from "@/components/forms/contact/ContactForm";
import styles from "./contact.module.css";
import { Mail, Clock, MapPin, Phone, Leaf, Facebook, Twitter, Instagram } from "lucide-react";

export const metadata = {
  title: "Contact Us",
  description: "If you have any questions or feedback, don't hesitate to reach out to us.",
  keywords: "Contact, TasteShare, food, recipes, community",
};

export default function ContactUs() {
  return (
    <div className={styles.pageWrapper}>
      <div className="containerTopNavbarColor" />

      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.watermarkText}>CONTACT</div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Contact Us</h1>
          <div className={styles.decorativeDivider}>
            <div className={styles.line} />
            <Leaf className={styles.dividerLeaf} size={24} />
            <div className={styles.line} />
          </div>
          <p className={styles.heroSubtext}>
            If you have any questions or feedback, please don't hesitate to reach out to us.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className={styles.mainContent}>
        {/* LEFT CARD: MAP & INFO */}
        <div className={styles.leftCard}>
          <div className={styles.mapContainer}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d150152.74778614956!2d115.16801351275534!3d-8.526943132468235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd21446b81f7d39%3A0x34b39c786c2e54ec!2sThe%20Amazing%20Taman%20Safari%20Bali!5e0!3m2!1str!2str!4v1757192339325!5m2!1str!2str"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div className={styles.contactGrid}>
            <div className={styles.infoItem}>
              <div className={styles.iconCircle}>
                <Mail size={20} />
              </div>
              <div className={styles.infoContent}>
                <h3>Email</h3>
                <p>info@example.com</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.iconCircle}>
                <MapPin size={20} />
              </div>
              <div className={styles.infoContent}>
                <h3>Address</h3>
                <p>Coding Str., Canggu, Bali</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.iconCircle}>
                <Clock size={20} />
              </div>
              <div className={styles.infoContent}>
                <h3>Hours</h3>
                <p>Mon-Fri: 9am-5pm</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.iconCircle}>
                <Phone size={20} />
              </div>
              <div className={styles.infoContent}>
                <h3>Phone</h3>
                <p>(123) 456-7890</p>
              </div>
            </div>
          </div>

          <div className={styles.socialRow}>
            <div className={styles.iconCircle}>
              <Facebook size={18} />
            </div>
            <div className={styles.iconCircle}>
              <Twitter size={18} />
            </div>
            <div className={styles.iconCircle}>
              <Instagram size={18} />
            </div>
          </div>
        </div>

        {/* RIGHT CARD: FORM */}
        <div className={styles.rightCard}>
          <ContactForm />
        </div>
      </main>
    </div>
  );
}