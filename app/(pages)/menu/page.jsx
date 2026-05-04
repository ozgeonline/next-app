import MenuPageContent from "./MenuPageContent";

export const metadata = {
  title: "Menu | TasteShare",
  description: "Discover our creative menu of original recipes - desserts, drinks, meals, and salads - served fresh in our restaurant.",
  keywords: ["menu", "restaurant", "desserts", "drinks", "meals", "salads", "TasteShare"],
  openGraph: {
    title: "Menu | TasteShare",
    description: "Explore our freshly crafted dishes inspired by community recipes.",
    type: "website",
  },
};

export default function MenuPage() {
  return <MenuPageContent />;
}
