import { createUploadthing, type FileRouter } from "uploadthing/server";
import { getUserFromCookies } from "@/lib/getUserFromCookies";

const f = createUploadthing();

export const ourFileRouter = {
  recipeImageUploader: f({
    image: {
      maxFileSize: "2MB",
      minFileCount: 1,
      maxFileCount: 1,
    },

  })
    .middleware(async () => {
      const user = await getUserFromCookies();

      if (!user) throw new Error("Unauthorized");

      return { userId: user.userId };
    })
    .onUploadError(({ error }) => {
      console.log("Upload error", error);
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log("Upload complete", file.ufsUrl);
      console.log("Upload complete for userId:", metadata.userId);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
