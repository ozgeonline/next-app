"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { saveMeal } from "@/lib/meals";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import { UTApi } from "uploadthing/server";

function isInvalidText(text) {
  return !text || text.trim() === '';
}

export default async function shareMeal(prevState, formData) {
  const user = await getUserFromCookies();

  if (!user) {
    redirect('/login');
  }

  const title = formData.get("title");
  const summary = formData.get("summary");
  const instructions = formData.get("instructions");
  const imageFile = formData.get("image");

  // Field-specific validation
  if (isInvalidText(title)) {
    return { message: 'Title is required.' };
  }
  if (isInvalidText(summary)) {
    return { message: 'Summary is required.' };
  }
  if (isInvalidText(instructions)) {
    return { message: 'Instructions are required.' };
  }
  if (!imageFile || imageFile.size === 0) {
    return { message: 'Please select an image.' };
  }

  // (1 MB = 1048576 byte)
  if (imageFile.size > 2 * 1048576) {
    return { message: 'Image size must be less than 2MB.' };
  }

  // Lazy Upload
  let imageUrl;
  try {
    const utapi = new UTApi();
    const response = await utapi.uploadFiles(imageFile);

    if (response.error) {
      console.error("UploadThing Error", response.error);
      return { message: "Failed to upload image." };
    }

    imageUrl = response.data.ufsUrl;
  } catch (e) {
    console.error("UTApi file upload failed", e);
    return { message: "Failed to upload image." };
  }

  // Save meal
  try {
    await saveMeal({
      title,
      summary,
      instructions,
      creator: user.name,
      creator_email: user.email,
      image: imageUrl,
    });
  } catch (e) {
    console.error("saveMeal failed", e);
    return { message: "Failed to save meal. Please try again." };
  }

  revalidatePath("/meals");
  redirect("/meals");
}