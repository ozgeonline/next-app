import { ArrowUp } from 'lucide-react';
import styles from "./top-scroll.module.css";

export default function TopScrollButton() {
  const handleScroll = () => {
   window.scrollTo({ top: 0, behavior: "smooth" }); 
  };

  return (
  <div className={styles.containerBottom} onClick={handleScroll}>
    <ArrowUp className={styles.arrow}/>
  </div>
  )
}