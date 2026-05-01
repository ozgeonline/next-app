import SharedMeals from "@/components/shared-meals/SharedMeals";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import { redirect } from "next/navigation";

export const metadata = {
  title: "My Shared Meals | TasteShare",
  description: "Manage the recipes you shared with the TasteShare community.",
};

export default async function SharedMealsPage() {
  const user = await getUserFromCookies();

  if (!user) {
    redirect("/login");
  }

  return <SharedMeals />;
}
