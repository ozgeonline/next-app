import MenuSection from "../../MenuSection";
import { menuLinks } from "../../menu-items";
import styles from "../category.module.css";
export default function Desserts() {
  const dessertsData = menuLinks.find(item => item.desserts)?.desserts;
  return (
    <div className={styles.menuItemsWrapper}>
      <MenuSection data={dessertsData} />
    </div>
  )
}