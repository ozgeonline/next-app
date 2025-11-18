import Image from "next/image";
import Link from "next/link";
import styles from "./reservation.module.css";
export default function ReservationBanner() {
  return (
    <div className={styles.container}>
      <div className={styles.rightImageWrapper}>
        <Image
          src="https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFDMEbEBCnlPGFDafBuW154icVrsNKdbwvp82nJ"
          alt="Order Hand"
          width={0}
          height={0}
          sizes="100%"
        />
      </div>
       <div className={styles.leftImageWrapper}>
        <Image
          src="https://9gdj1dewg7.ufs.sh/f/MzCIEEnlPGFDBs9bBdxNmQAqG8cge0hkoTSVZRJ3fPUHijlp"
          alt="image"
          width={0}
          height={0}
          sizes="100%"
        />
      </div>
      <h2>for a Wonderful Experience</h2>
      <div className={styles.reservation}>
        <Link href="/reservations">
          Make Reservation 
        </Link>
      </div>
      <div className={styles.blurOverlayTop}/>
      <div className={styles.blurOverlayBottom}/>
    </div>
  )
}