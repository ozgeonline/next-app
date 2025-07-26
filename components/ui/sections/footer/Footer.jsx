import {links} from "./link-items";
import Link from "next/link";
import styles from "./footer.module.css";
import ContactForm from "@/components/ui/actions/form/contact/ContactForm";
import SocialMedia from "../../social/SocialMedia";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.leftArea}>
          <div className={styles.info}>
            {/* Links Section */}
            <div className={styles.links}>
              <h3>Explore</h3>
              <ul>
                {links.map((link) => (
                    <li key={link.id}>
                      <Link href={link.href}>{link.name}</Link>
                    </li>
                  ))
                }
              </ul>
            </div>

            {/* Address Section */}
            <div className={styles.address}>
              <h3>Contact Us</h3>
              <p>Coding Str., 123</p>
              <p>Canggu, Bali, ZIP 12345</p>
              <p>Email: <a href="mailto:info@example.com">info@example.com</a></p>
              <p>Phone: <a href="tel:+1234567890">+1 (234) 567-890</a></p>
            </div>
          </div>
          <div className={styles.socialMediaWrapper}>
            <SocialMedia />
          </div>
        </div>
        <div className={styles.formWrapper}>
          <ContactForm />
        </div>
      </div>

      {/* Copyright */}
      <div className={styles.copyright}>
        <p>&copy; {new Date().getFullYear()} ozgeonline. All rights reserved.</p>
      </div>
    </footer>
  )
}