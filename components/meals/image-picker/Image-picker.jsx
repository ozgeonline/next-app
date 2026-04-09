"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./image-picker.module.css";

export default function ImagePicker({ label, name }) {
  const [pickedImage, setPickedImage] = useState(null);
  const [error, setError] = useState(null);
  const imageInputRef = useRef();

  function handlePickClick() {
    imageInputRef.current?.click();
  }

  function handleImageChange(event) {
    const file = event.target.files[0];

    if (!file) {
      setPickedImage(null);
      setError(null);
      return;
    }

    if (file.size > 2 * 1048576) {
      setError("Please select an image smaller than 2MB.");
      event.target.value = "";
      setPickedImage(null);
      return;
    }

    setError(null);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPickedImage(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }

  return (
    <div className={styles.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={styles.controls}>
        <div className={styles.preview}>
          {!pickedImage && <p>No image chosen</p>}
          {pickedImage && (
            <Image src={pickedImage} alt="Picked image" fill className={styles.image} />
          )}
        </div>

        <input
          className={styles.input}
          type="file"
          id={name}
          accept="image/png, image/jpeg, image/webp"
          name={name}
          ref={imageInputRef}
          onChange={handleImageChange}
        />

        <div className={styles.uploadContainer}>
          <button
            className="accent-link-button"
            type="button"
            onClick={handlePickClick}
          >
            pick an image
          </button>

          <Link href="./" className={`accent-link-button ${styles.backButton}`}>
            back meals
          </Link>
          {error && <p className={styles.errorText}>{error}</p>}
        </div>
      </div>
    </div>
  );
}