import styles from "./about.module.css";

export const metadata = {
  title: "About Us",
  description:
    "Learn more about TasteShare and our mission to bring people together through food.",
  keywords: "TasteShare, food, recipes, community"
};

export default function AboutPage() {
  return (
    <main className={styles["about-container"] + ' ' + "mainBackground"}>
      <div className="containerTopNavbarColor"/>
      <section className={styles["about-content"]}>
        <h1 className={styles["about-title"]}>About Us</h1>
        <p className={styles["about-text"]}>
          Welcome to the <strong> creativity </strong> of <strong> food </strong>, a place where
          culinary inspiration meets community.
          We’re not just a restaurant; we’re a community built around food,
          flavor, and inspiration.
        </p>
        <p className={styles["about-text"]}>
          Here, our guests enjoy meals made from <strong>original recipes</strong>{" "}
          shared by our community. Every dish you taste might come from a
          passionate home chef or a food lover like you.
        </p>
        <p className={styles["about-text"]}>
          Our mission is to bring people together through cooking, sharing, and
          discovering new flavors because the best meals are the ones we create
          and enjoy <strong>together</strong>.
        </p>
        <p className={styles["about-text"]}>
          Join us, share your own recipes, and experience how food can connect
          us all.
        </p>
      </section>
    </main>
  );
}
