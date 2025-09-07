import Image from "next/image";
import styles from "./recipes.module.css";
import image from "@/public/cafe/BG/5.jpg";
import Link from "next/link";

interface RecipesCardProps {
  spotlight: boolean
}
export default function RecipesCard({
  spotlight
}: RecipesCardProps) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
         <div className={styles["recipe-card"]}>
          <div className={spotlight ? styles["spotlight-image"] : styles["recipe-image"]}>
            <Image 
              src={image} 
              alt="recipes-card" 
              width={0} 
              height={0} 
              sizes="(max-width: 768px) 100vw, 33vw"
              className={styles["image-inner"]}
              />
          </div>
          <div className={styles["recipe-overlay"]}>
            {spotlight && (
              <div className={styles["spotlight-info"]}>
                <h3>Pasta Primavera</h3>
                <p>Fresh veggies with creamy sauce</p>
                <span className="stars">⭐⭐⭐⭐</span>
                <Link href="/meals" className={styles["spotlight-button"]}>
                  See Recipe
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}