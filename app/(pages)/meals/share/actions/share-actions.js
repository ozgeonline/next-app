"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { saveMeal } from "@/lib/meals";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

function isInvalidText(text) {
  return !text || text.trim() === '';
}

export default async function shareMeal(prevState, formData) {
  const user = await getUserFromCookies();

  if (!user) {
    redirect('/login'); 
  }

  const imageFile = formData.get("image");

  const meal = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    instructions: formData.get("instructions"),
    creator: user.name,
    creator_email: user.email,
  };

  if(
    isInvalidText(meal.title) || 
    isInvalidText(meal.summary) || 
    isInvalidText(meal.instructions) || 
    isInvalidText(meal.creator) || 
    isInvalidText(meal.creator_email) ||
    !meal.creator_email.includes('@') ||
    !imageFile ||
    imageFile.size === 0
  ) {
    return {
      message:'Please fill out all fields.'
    }
  }

  // (1 MB = 1048576 byte)
  if (imageFile.size > 2 * 1048576) {
    return {
      message: 'Image size must be less than 2MB.'
    };
  }

  // Handle Lazy Upload Here
  try {
    const response = await utapi.uploadFiles(imageFile); 
    if(response.error) {
       console.error("UploadThing Error", response.error);
       return { message: "Failed to upload image." }
    }

    meal.image = response.data.ufsUrl;
  } catch(e) {
     console.error("UTApi file upload failed", e);
     return { message: "Failed to upload image." }
  }

  await saveMeal(meal);
  revalidatePath("/meals");
  redirect("/meals");
}