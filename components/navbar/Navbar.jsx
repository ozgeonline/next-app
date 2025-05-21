import NavLink from "./navigation/NavLink";
import DarkLightToogle from "./features/DarkLightToogle";
import { links } from "./navigation/navlinks.constant";
import DropdownNavbarMenu from "./navigation/DropdownNavbarMenu";
import Logo from "@/assets/Logo"
import styles from "./navbar.module.css";

export default function Navbar() {
  return (
    <div className={styles.container} >
      <header className={styles.header}>
        <Logo />
        <nav className={styles.nav}>
          {/* for desktop screen */}
          <div className={styles.desktopNav}>
            <ul>
              {links.map((link) => (
                <li key={link.id}>
                  <NavLink href={link.href}>{link.name}</NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* for mobile screen */}
          <div className={styles.mobileNav}>
            <DropdownNavbarMenu>
              <ul>
                {links.map((link) => (
                  <li key={link.id}>
                    <NavLink href={link.href}>{link.name}</NavLink>
                  </li>
                ))}
              </ul>
            </DropdownNavbarMenu>
          </div>
        </nav>
        <DarkLightToogle />
      </header>
    </div>
  )
}