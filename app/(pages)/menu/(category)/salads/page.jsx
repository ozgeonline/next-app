import {MenuSection} from "@/components/menu/MenuSection";
import { menuLinks } from "../../menu-items";
import styles from "../category.module.css";
export default function Salads() {
  const saladsData = menuLinks.find(item => item.salads)?.salads;
    return (
      <div className={styles.menuItemsWrapper}>
        <MenuSection data={saladsData} />
      </div>
    )
  };