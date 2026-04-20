/**
 * Dynamic Category Page
 * Handles Desserts, Drinks, Meals, and Salads using a single route.
 */

import { MenuSection } from "@/components/menu/MenuSection";
import { menuLinks } from "../../menu-items";
import { notFound } from "next/navigation";
import styles from "../category.module.css";

export async function generateMetadata({ params }) {
  const { categoryName } = params;
  const categoryData = menuLinks.find(item => item[categoryName])?.[categoryName];

  if (!categoryData) return { title: "Category Not Found" };

  return {
    title: `${categoryData.title} | TasteShare Menu`,
    description: `Explore our collection of fresh ${categoryData.title.toLowerCase()} at TasteShare.`,
  };
}

export default function CategoryPage({ params }) {
  const { categoryName } = params;

  // Find the data based on the dynamic route parameter
  const categoryData = menuLinks.find(item => item[categoryName])?.[categoryName];

  if (!categoryData) {
    notFound();
  }

  return (
    <div className={styles.menuItemsWrapper}>
      <MenuSection data={categoryData} />
    </div>
  );
}

// Generate static routes for all categories in menuLinks
export async function generateStaticParams() {
  const paths = menuLinks.map((item) => {
    const key = Object.keys(item)[0];
    return { categoryName: key };
  });

  return paths;
}
