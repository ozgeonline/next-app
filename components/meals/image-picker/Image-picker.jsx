"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { UploadButton } from "@/utils/upload/uploadthing";
import { useAuth } from "@/context/auth/AuthProvider";
import styles from "./image-picker.module.css";

const UPLOAD_BUTTON_APPEARANCE = {
  button({ isUploading }) {
    return {
      fontSize: "0.8em",
      color: "#FFFFFF",
      background: "#0466c8",
      padding: "0.5rem 1.5rem",
      borderRadius: "4px",
      fontWeight: "bold",
      border: "none",
      cursor: "pointer",
      ...(isUploading && { filter: "brightness(0.9)" }),
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    };
  },
  container: {
    marginTop: "1rem",
  },
  allowedContent: {
    color: "#a1a1aa",
  },
};

export default function ImagePicker({ label, name }) {
  const { isAuthenticated } = useAuth();
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [error, setError] = useState(null);

  function handleClientUpload(res) {
    if (!res) return;
    const file = res[0].ufsUrl;
    setUploadedImageUrl(file);
    setError(null);
  }

  function handleUploadError(error) {
    if (process.env.NODE_ENV === "development") {
      console.error(`Upload Error: ${error.message}`);
    }
    setError(error.message.split(": ")[1] || error.message);
  }

  return (
    <div className={styles.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={styles.controls}>
        <div className={styles.preview}>
          {!uploadedImageUrl && <p>No image chosen</p>}
          {uploadedImageUrl && (
            <Image src={uploadedImageUrl} alt="Picked image" fill className={styles.image} />
          )}
        </div>

        {uploadedImageUrl && (
          <input
            type="hidden"
            name={name}
            id={name}
            value={uploadedImageUrl}
          />
        )}

        <div className={styles.uploadContainer}>
          {isAuthenticated && (
            <UploadButton
              endpoint="recipeImageUploader"
              onClientUploadComplete={handleClientUpload}
              onUploadError={handleUploadError}
              appearance={UPLOAD_BUTTON_APPEARANCE}
            />
          )}
          <Link href="./" className={`button-gold-blue ${styles.backButton}`}>
            back meals
          </Link>
          {error && <p className={styles.errorText}>{error}</p>}
        </div>
      </div>
    </div>
  )
}