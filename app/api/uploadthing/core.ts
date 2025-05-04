import { createUploadthing, type FileRouter } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  recipeImageUploader: f({ 
    image: {
      maxFileSize: "2MB",
      minFileCount: 1,
      maxFileCount: 1,
      
    },
    
  }).onUploadError(({ error }) => {
    console.log("Upload error", error);
  }).onUploadComplete(({ metadata, file }) => {
      console.log("Upload complete", file.ufsUrl);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
