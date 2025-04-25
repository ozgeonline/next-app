"use client";

import { useRef, useState } from "react";
import styles from "./image-picker.module.css";
import Image from "next/image";
export default function ImagePicker({label,name}) {
  const [pickedImg, setPickedImg] = useState();
  const imgInput = useRef();

  function handlePickClick() {
    imgInput.current.click();
  }

  function handleImgChange(e) {
    const file = e.target.files[0];
    if (!file) {
      setPickedImg(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPickedImg(reader.result);
    };
    reader.readAsDataURL(file);
  }
  
  return (
    <div className={styles.picker}>
      <label htmlFor={name}>{label}</label>
      <div className={styles.controls}>
        <div className={styles.preview}>
          {!pickedImg && (<p>No image chosen</p>)}
          {pickedImg && (
            <Image src={pickedImg} alt="Picked image" fill />
          )}
        </div>
        <input
          ref={imgInput}
          onChange={handleImgChange}
          id={name}
          name={name}
          type="file"
          accept="image/png, image/jpeg"
          className={styles.input}
          required
        />
        <button className={styles.button} type="button" onClick={handlePickClick}>
          Upload Image
        </button>

      </div>

    </div>
  )
}