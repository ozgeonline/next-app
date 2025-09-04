import styles from "./contact.module.css";
export default function ContactUs() {
  return (
    <div className={styles.container + ' ' + "mainBackground"}>
      <h1>Contact Us</h1>
      <p>This is the contact us page.</p>
    </div>
  );
}