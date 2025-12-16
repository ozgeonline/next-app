"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { UploadButton } from "@/utils/upload/uploadthing";
import { useAuth } from "@/context/auth/AuthProvider";
import styles from "./image-picker.module.css";
import Image from "next/image";

export default function ImagePicker({ label, name }) {
  const { isAuthenticated } = useAuth();
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [error, setError] = useState(null);
  const imgInput = useRef();

  function handlePickClick() {
    imgInput.current.click();
    setError(null);
  }

  function handleClientUpload(res) {
    const file = res[0].ufsUrl;
    setUploadedImageUrl(file);
    if (!file) {
      setError(null);
      return;
    }
  }

  function handleUploadError(error) {
    console.log(`ERROR! ${error.message}`);
    setError(error.message.split(": ")[1]);
  }

  return (
    <div className={styles.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={styles.controls}>
        <div className={styles.preview}>
          {!uploadedImageUrl && <p>No image chosen</p>}
          {uploadedImageUrl && (
            <Image src={uploadedImageUrl} alt="Picked image" fill type="image/webp" />
          )}
        </div>

        {uploadedImageUrl && (
          <input
            ref={imgInput}
            type="hidden"
            name={name}
            id={name}
            value={uploadedImageUrl}
          />
        )}

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {isAuthenticated && (
            <UploadButton
              ref={imgInput}
              onClick={handlePickClick}
              endpoint="recipeImageUploader"
              onClientUploadComplete={handleClientUpload}
              onChange={handleClientUpload}
              onUploadError={handleUploadError}
              appearance={{
                button({ ready, isUploading }) {
                  return {
                    fontSize: "0.8em",
                    color: "black",
                    ...(ready && { color: "#ecfdf5" }),
                    ...(isUploading && { color: "#d1d5db" }),
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
              }}
            />
          )}
          <Link href="./" className="button-gold-blue">
            back meals
          </Link>
          {error && <p style={{ fontSize: "0.8em" }}>{error}</p>}
        </div>
      </div>
    </div>
  )
}