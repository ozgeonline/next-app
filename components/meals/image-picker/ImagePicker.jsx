// Image picker component:
// allows users to select and preview an image for a meal.

"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { CloudUpload, X } from "lucide-react";
import styles from "./image-picker.module.css";

export default function ImagePicker({ label, name }) {
  const [pickedImage, setPickedImage] = useState(null);
  const [error, setError] = useState(null);
  const [fileDetails, setFileDetails] = useState(null);
  const imageInputRef = useRef();

  const [isDragging, setIsDragging] = useState(false);

  function handlePickClick() {
    imageInputRef.current?.click();
  }

  function processFile(file) {
    if (!file) {
      clearImage();
      return;
    }

    if (file.size > 2 * 1048576) { // 2MB limit
      setError("Please select an image smaller than 2MB.");
      if (imageInputRef.current) imageInputRef.current.value = "";
      clearImage();
      return;
    }

    setError(null);
    setFileDetails({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(1) + " MB"
    });

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPickedImage(fileReader.result);
    };
    fileReader.readAsDataURL(file);

    // Sync file to input for form submission
    if (imageInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      imageInputRef.current.files = dataTransfer.files;
    }
  }

  function handleImageChange(event) {
    processFile(event.target.files[0]);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }

  function clearImage() {
    setPickedImage(null);
    setFileDetails(null);
    setError(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }

  return (
    <div className={styles.picker}>
      {label && <label htmlFor={name}>{label}</label>}
      <div 
        className={`${styles.controls} ${isDragging ? styles.dragging : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >

        {/* Upload Box */}
        <div className={styles.uploadBox} onClick={handlePickClick}>
          <CloudUpload size={36} className={styles.cloudIcon} strokeWidth={1.5} />
          <p className={styles.uploadText}>
            Drag & drop your image here <br />
            or <span className={styles.browseText}>click to browse</span>
          </p>
          <p className={styles.uploadSubtext}>JPG, PNG or WebP (max. 2MB)</p>
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

        {/* Image Preview (side by side) */}
        {pickedImage && (
          <div className={styles.previewCard}>
            <div className={styles.imageWrapper}>
              <Image src={pickedImage} alt="Picked image" fill className={styles.image} />
              <button
                type="button"
                className={styles.removeButton}
                onClick={(e) => { e.stopPropagation(); clearImage(); }}
              >
                <X size={14} />
              </button>
            </div>
            {fileDetails && (
              <div className={styles.fileInfo}>
                <p className={styles.fileName}>{fileDetails.name}</p>
                <p className={styles.fileSize}>{fileDetails.size}</p>
              </div>
            )}
          </div>
        )}

      </div>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
}