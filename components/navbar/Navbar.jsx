"use client"
import NavLink from "./navigation/NavLink";
import DarkLightToogle from "./features/DarkLightToogle";
import Logo from "@/assets/Logo"
import styles from "./navbar.module.css";
import { links } from "./navigation/navlinks.constant";
export default function Navbar() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Logo />

        <nav className={styles.nav}>
          <ul>
            <li>
              {links.map((link) => (
                  <NavLink href={link.href} key={link.id}>
                    {link.name}
                  </NavLink>
                ))
              }
            </li>
          </ul>
        </nav>

        <DarkLightToogle />
      </header>
    </div>
  )
}