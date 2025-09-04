import MenuSection from "../MenuSection";
import { menuLinks } from "../../menu-items";
import styles from "../category.module.css";
export default function Drinks() {
  const drinksData = menuLinks.find(item => item.drinks)?.drinks;
    return (
      <div className={styles.menuItemsWrapper}>
        <MenuSection data={drinksData} />
      </div>
    )
}