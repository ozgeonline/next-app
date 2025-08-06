import MenuSection from "../../MenuSection";
import { menuLinks } from "../../menu-items";
import styles from "../category.module.css";
export default function Meals() {
  const mealsData = menuLinks.find(item => item.meals)?.meals;
    return (
      <div className={styles.menuItemsWrapper}>
        <MenuSection data={mealsData} />
      </div>
    )
  };