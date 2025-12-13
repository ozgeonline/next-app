"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { saveMeal } from "@/lib/meals";
import { getUserFromCookies } from "@/lib/getUserFromCookies";

function isInvalidText(text) {
  return !text || text.trim() === '';
}

export default async function shareMeal(prevState,formData) {
  const user = await getUserFromCookies();

  const meal = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    instructions: formData.get("instructions"),
    creator: user.name,
    creator_email: user.email,
    image: formData.get("image")
  };

  //console.log("Form data:", Object.fromEntries(formData));

  // if (prevState !== undefined) {
  //   //console.log(`Previous state: ${prevState.message}`);
  // }

  if(
    isInvalidText(meal.title) || 
    isInvalidText(meal.summary) || 
    isInvalidText(meal.instructions) || 
    isInvalidText(meal.creator) || 
    isInvalidText(meal.creator_email) ||
    !meal.creator_email.includes('@') ||
    !meal.image ||
    meal.image === ""
  ) {
    return {
      message:'Please fill out all fields.'
    }
  }

  await saveMeal(meal);
  revalidatePath("/meals");
  redirect("/meals");
}