"use client";

import Link from "next/link";
import ContactForm from "@/components/forms/contact/ContactForm";
import styles from "./footer.module.css";
import { ArrowRight, Leaf } from "lucide-react";
import { socialLinks, quickLinks, contactInfo, uspItems, legalLinksData } from "./link-items";

export default function Footer() {

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* TOP SECTION: 4 COLUMNS */}
        <div className={styles.topGrid}>

          {/* COLUMN 1: BRAND */}
          <div className={styles.brandCol}>
            <div className={styles.logoArea}>
              <span className={styles.logoText}>online.</span>
            </div>
            <p className={styles.brandDesc}>
              Good food brings people together. Discover, share and enjoy delicious moments with our community of food lovers.
            </p>

            <div className={styles.newsletter}>
              <h4 className={styles.newsletterTitle}>Stay in the loop</h4>
              <p className={styles.newsletterSub}>Get the latest recipes, tips and updates.</p>
              <div className={styles.inputGroup}>
                <input type="email" placeholder="Enter your email" />
                <button className={styles.submitBtn}>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            <div className={styles.socialRow}>
              {socialLinks.map((social, idx) => (
                <Link key={idx} href={social.href} className={styles.socialIcon} aria-label={social.label}>
                  <social.icon size={18} />
                </Link>
              ))}
            </div>


          </div>

          {/* COLUMN 2: QUICK LINKS */}
          <div className={styles.linksCol}>
            <h3 className={styles.colTitle}>Quick Links</h3>
            <ul className={styles.linkList}>
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className={styles.linkItem}>
                    <link.icon className={styles.linkIcon} size={16} /> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: CONTACT INFO */}
          <div className={styles.contactCol}>
            <h3 className={styles.colTitle}>Contact Info</h3>
            <ul className={styles.linkList}>
              {contactInfo.map((info, idx) => (
                <li key={idx} className={styles.linkItem}>
                  <info.icon className={styles.linkIcon} size={16} /> {info.text}
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: FORM */}
          <div className={styles.formCol}>
            <Leaf className={styles.decorativeLeaf} size={40} strokeWidth={1} />
            <ContactForm />
          </div>
        </div>

        {/* MIDDLE SECTION: USP ROW */}
        <div className={styles.uspRow}>
          {uspItems.map((usp, idx) => (
            <div key={idx} className={styles.uspItem}>
              <div className={styles.uspIconCircle}><usp.icon size={24} /></div>
              <div className={styles.uspContent}>
                <h4>{usp.title}</h4>
                <p>{usp.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM SECTION: COPYRIGHT & LEGAL */}
        <div className={styles.bottomBar}>
          <div className={styles.copyright}>
            © {new Date().getFullYear()} ozgeonline. All rights reserved.
          </div>

          <div className={styles.dividerContainer}>
            <div className={styles.dividerLine} />
            <Leaf className={styles.leafIcon} size={20} />
            <div className={styles.dividerLine} />
          </div>

          <div className={styles.legalLinks}>
            {legalLinksData.map((link, idx) => (
              <Link key={idx} href={link.href} className={styles.legalLink}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Leaf className={styles.bgLeaf} size={100} />
    </footer>
  );
}