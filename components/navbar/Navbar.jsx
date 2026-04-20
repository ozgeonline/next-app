"use client";

import dynamic from 'next/dynamic';
import { links } from "./navlinks.constant";
import DarkLightToggle from "@/components/settings/theme/DarkLightToggle";
import { useNavbarScroll } from "@/hooks/useNavbarScroll";
import Logo from "@/components/ui/branding/logo/Logo"
import styles from "./navbar.module.css";

const NavLink = dynamic(() => import('./navigation/NavLink'), { ssr: false });
const DropdownNavbarMenu = dynamic(() => import('./navigation/DropdownNavbarMenu'), { ssr: false });

export default function Navbar() {
  const scrolling = useNavbarScroll();

  return (
    <div className={`${styles.container} ${scrolling ? styles.navbarScroll : ""}`}>
      <header className={styles.header}>
        <Logo />
        <nav className={styles.nav}>
          {/* for desktop screen */}
          <div className={styles.desktopNav}>
            <ul>
              <li>
                {links.map((link) => (
                  <NavLink key={link.id} href={link.href}>
                    {link.name}
                  </NavLink>
                ))}
              </li>
            </ul>
          </div>

          {/* for mobile screen */}
          <div className={styles.mobileNav}>
            <DropdownNavbarMenu>
              <ul>
                <li>
                  {links.map((link) => (
                    <NavLink key={link.id} href={link.href}>
                      {link.name}
                    </NavLink>
                  ))}
                </li>
              </ul>
            </DropdownNavbarMenu>
          </div>
        </nav>

        <DarkLightToggle />
      </header>
    </div>
  )
}