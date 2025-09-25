"use client";

import dynamic from 'next/dynamic';
import { links } from "./navlinks.constant";
import { ScrollProvider } from '@/context/navbar/ScrollingContext';
import DarkLightToogle from "../settings/theme/DarkLightToogle";
import Logo from "@/components/ui/assets/logo/Logo"
import styles from "./navbar.module.css";

const NavLink = dynamic(() => import('./navigation/NavLink'), { ssr: false });
const DropdownNavbarMenu = dynamic(() => import('./navigation/DropdownNavbarMenu'), { ssr: false });

export default function Navbar() {
  return (
    <ScrollProvider>
      <div className={styles.container}>
        <header className={styles.header}>
          <Logo />
          <nav className={styles.nav}>
            {/* for desktop screen */}
            <div className={styles.desktopNav}>
              <ul>
                <li>
                  {links.map((link) => (
                    <NavLink  key={link.id} href={link.href}>
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
          
          <DarkLightToogle />
        </header>
      </div>
    </ScrollProvider> 
  )
}