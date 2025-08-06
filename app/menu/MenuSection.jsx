import MenuPreview from "@/components/menu/MenuPreview";
import styles from "../menu/menu.module.css";

export default function MenuSection({ data }) {
  return (
    <div className={styles.menuItemsWrapper}>
      {data.menuItems.map((menuItem, i) => (
        <MenuPreview
          key={i}
          src={menuItem.image}
          description={menuItem.description}
          price={menuItem.price}
          title={menuItem.name}
          isNew={menuItem.isNew}
        />
      ))}
    </div>
  );
}