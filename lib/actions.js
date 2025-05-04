"use server";

import { redirect } from "next/navigation";
import { saveMeal } from "./meals";
import { revalidatePath } from "next/cache";

function isInvalidText(text) {
  return !text || text.trim() === '';
}

export default async function shareMeal(prevState,formData) {
  const meal = {
    title: formData.get('title'),
    summary: formData.get('summary'),
    instructions: formData.get('instructions'),
    creator: formData.get('name'),
    creator_email: formData.get('email')
  }
  const imageFile = formData.get('image');
  if (imageFile) {
    meal.image = imageFile;
  }
  //console.log("imageFile is:", imageFile);

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
    // throw new Error('Please fill out all fields');
    return {
      message:'Please fill out all fields.'
    }
    
  }

  await saveMeal(meal);
  revalidatePath('/meals');
  redirect('/meals');
  

}