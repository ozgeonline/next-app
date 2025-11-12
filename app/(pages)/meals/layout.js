import styles from "./layout.module.css";

export default function MealsLayout({ children }) {
  return (
    <div className={styles.container + ' ' + "mainBackground"}>
      <div className="containerTopNavbarColor" />
      {children}
    </div>
  );
}