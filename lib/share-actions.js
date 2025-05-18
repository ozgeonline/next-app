"use server";

import connect from "./db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import xss from "xss";
import Meal from "@/app/meals/models/Meal";

function isInvalidText(text) {
  return !text || text.trim() === '';
}

export default async function shareMeal(prevState,formData) {
  await connect();
  const meal = {
    title: xss(formData.get("title")),
    slug : slugify(formData.get('title'), { lower: true }),
    summary: xss(formData.get("summary")),
    instructions: xss(formData.get("instructions")),
    creator: xss(formData.get("name")),
    creator_email: xss(formData.get("email")),
  }

  const imageFile = formData.get('image');
  if (imageFile) {
    meal.image = imageFile;
  }

  let slug = slugify(meal.title, { lower: true });
  let counter = 1;
  while (await Meal.findOne({ slug })) {
    slug = `${slugify(meal.title, { lower: true })}-${counter}`;
    counter++;
  }
  meal.slug = slug;

  if (typeof meal.image === 'string' && !meal.image.startsWith('http')) {
    meal.image = `/images/${meal.slug}`;
  }

  //console.log("Form data:", Object.fromEntries(formData));

  if (prevState !== undefined) {
    console.log(`Previous state: ${prevState.message}`);
  }

  if(
    isInvalidText(meal.title) || 
    isInvalidText(meal.summary) || 
    isInvalidText(meal.instructions) || 
    isInvalidText(meal.creator) || 
    isInvalidText(meal.creator_email) ||
    !meal.creator_email.includes('@') ||
    !meal.image || 
    meal.image.size === "0"
  ) {
    return {
      message:'Please fill out all fields.'
    }
  }

  await Meal.create(meal);
  revalidatePath("/meals");
  redirect("/meals");
}